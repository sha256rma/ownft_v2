#!/bin/bash

tar czf - $1 | ssh pi@10.0.8.37 -p 22 "cd ~; tar xzf -"
