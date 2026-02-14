
for i in range(7):
    for j in range(7):
        if i==0 or j ==0 or i==6 or (j==6  and i>6/2-1) or (i==3 and j>2):
            print("* ", end="")
        else:
            print("  ",end="")
    print()