# python script for freezing dependencies but not the runtime code
import os
import importlib
import sys

# import all libs used at runtime
# pyinstaller will freeze it
import head

if getattr(sys, 'frozen', False):
    VAR_CWD = os.path.dirname(sys.executable)
    sys.path.insert(1, VAR_CWD)

sys.path.insert(1, os.getcwd())

# dynamically import runtime code
importlib.import_module('main')
