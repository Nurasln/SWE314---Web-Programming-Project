import sys
import traceback

try:
    import models
    print("Models imported successfully")
except Exception as e:
    traceback.print_exc()
