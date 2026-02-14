import math
import os
import random
import re
import sys

def getDistance(word):
    keyboard = {
        'Q': (0, 0), 'W': (0, 1), 'E': (0, 2), 'R': (0, 3), 'T': (0, 4), 'Y': (0, 5), 'U': (0, 6), 'I': (0, 7), 'O': (0, 8), 'P': (0, 9),
        'A': (1, 0), 'S': (1, 1), 'D': (1, 2), 'F': (1, 3), 'G': (1, 4), 'H': (1, 5), 'J': (1, 6), 'K': (1, 7), 'L': (1, 8), ';': (1,9), ' ': (2,0),
        'Z': (2, 1), 'X': (2, 2), 'C': (2, 3), 'V': (2, 4), 'B': (2, 5), 'N': (2, 6), 'M': (2, 7), ',': (2, 8), '.': (2, 9)
    }
    current_position = keyboard['Q']
    total_distance = 0
    for char in word:
        target_position=keyboard[char]
        distance=abs(current_position[0] - target_position[0]) + abs(current_position[1] - target_position[1])
        total_distance += distance
        current_position= target_position
    return total_distance

if __name__ == '__main__':
    word = input()
    result = getDistance(word)
    print(
        result
    )
