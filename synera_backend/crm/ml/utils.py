import joblib
import pandas as pd
from pathlib import Path

# Path to trained ML model
model_path = Path(__file__).resolve().parent / "ml" / "lead_scoring_model.pkl"

try:
    model = joblib.load(model_path)
except Exception as e:
    model = None
    print(f"ML model not loaded: {e}")


def calculate_lead_score(lead):
    """
    Takes a Lead object and returns predicted probability (%) of conversion
    using available Lead fields.
    """

    # If ML model is not available, fallback to simple rule-based scoring
    if model is None:
        status_map = {
            'new': 10,
            'contacted': 40,
            'qualified': 70,
            'lost': 0,
            'won': 100
        }
        score = status_map.get(lead.status, 0)
        score += int(lead.sentiment_score * 50)  # scale -1..1 to -50..50
        return max(0, min(100, score))

    # Prepare features for ML model
    features = pd.DataFrame([{
        "sentiment_score": lead.sentiment_score,
        "status_Contacted": 1 if lead.status == "contacted" else 0,
        "status_Qualified": 1 if lead.status == "qualified" else 0,
        "status_Lost": 1 if lead.status == "lost" else 0,
        "status_Won": 1 if lead.status == "won" else 0,
        "status_New": 1 if lead.status == "new" else 0,
    }])

    try:
        probability = model.predict_proba(features)[0][1]  # probability of conversion
        return round(probability * 100, 2)
    except Exception as e:
        print(f"ML scoring failed, fallback: {e}")
        status_map = {
            'new': 10,
            'contacted': 40,
            'qualified': 70,
            'lost': 0,
            'won': 100
        }
        score = status_map.get(lead.status, 0)
        score += int(lead.sentiment_score * 50)
        return max(0, min(100, score))
