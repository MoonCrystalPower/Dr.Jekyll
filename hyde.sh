#! /bin/bash
git submodule init
git submodule update
cd Dr.Hyde
if [ ! -d venv ]
then
  python3 -m venv venv
  . venv/bin/activate
  pip install --upgrade pip
  pip install -r test-requirements.txt -r requirements.txt
  git clone https://github.com/boolsajo/PyHtml2Md
  cd PyHtml2Md
  python setup.py install
  echo 'Install complete'
else
  echo 'Nothing to install'
fi
exit 0 