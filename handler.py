import runpod
import os

# Nov yog koj lub function uas yuav tsum teb cov job
def handler(job):
    job_input = job['input']
    
    # --- KOJ LI AI LOGIC NTAWM NO ---
    # Piv txwv:
    # prompt = job_input.get('text', 'Hello')
    # result = f5tts_model.generate(prompt)
    # --------------------------------
    
    return {
        "status": "completed",
        "message": "AI generated lawm",
        "result": "Cov ntawv/suab uas koj xav tau"
    }

# Pib lub server
runpod.serverless.start({"handler": handler})
