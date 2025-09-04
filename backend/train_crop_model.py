import pandas as pd
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
# df = pd.read_csv("data/Crop_recomendation.csv")
# df = pd.read_csv(r"data/Crop_recommendation.csv")
df = pd.read_csv(r"data/Crop_recommendation.csv")

# Features and target
X = df[["N", "P", "K", "Temperature", "Humidity", "ph", "Rainfall"]]
y = df["Crop"]

# Encode target labels (Crop names → numbers)
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# LightGBM dataset format
train_data = lgb.Dataset(X_train, label=y_train)
test_data = lgb.Dataset(X_test, label=y_test)

# Train model
params = {
    "objective": "multiclass",
    "num_class": len(encoder.classes_),
    "boosting_type": "gbdt",
    "metric": "multi_logloss",
    "learning_rate": 0.05,
    "num_leaves": 31,
    "max_depth": -1
}

model = lgb.train(
    params, 
    train_data, 
    valid_sets=[test_data], 
    num_boost_round=500, 
    callbacks=[lgb.early_stopping(stopping_rounds=50)]
)

# Evaluate
y_pred = model.predict(X_test)
y_pred_classes = [y.argmax() for y in y_pred]
acc = accuracy_score(y_test, y_pred_classes)
print(f"Model Accuracy: {acc:.2f}")

# Save model + encoder
joblib.dump(model, "models/crop_recommendation_model.pkl")
joblib.dump(encoder, "models/crop_label_encoder.pkl")

print("✅ Model and encoder saved!")
