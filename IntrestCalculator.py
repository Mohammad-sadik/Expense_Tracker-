def simple_interest(principal, term, rate):
    interest_earned = (principal * (rate / 100) * term)
    total_amount = interest_earned + principal
    print("=" * 50)
    print("The simple interest earned amount is: {:.2f}".format(interest_earned))
    print("The total amount (Interest + Principal): {:.2f}".format(total_amount))
    print("=" * 50)

def compound_interest(principal, term, rate):
    interest_earned = ((principal * (1 + (rate / 100)) ** term) - principal)
    total_amount = interest_earned + principal
    print("=" * 50)
    print("The compound interest earned amount is: {:.2f}".format(interest_earned))
    print("The total amount (Interest + Principal): {:.2f}".format(total_amount))
    print("=" * 50)

def inputs():
    try:
        principal = float(input("Enter Principal amount: "))
        term = float(input("Enter Time in Years: "))
        rate = float(input("Enter the Rate of Interest: "))
        return principal, term, rate
    except ValueError:
        print("Please enter only numbers.")
        return inputs()

def main():
    while True:
        type_intrest = input("Do you want to select Type of Interest? 1.Simple Interest, 2. Compound Interest: ")

        if type_intrest == "1":
            principal, term, rate = inputs()
            simple_interest(principal, term, rate)
        elif type_intrest == "2":
            principal, term, rate = inputs()
            compound_interest(principal, term, rate)
        elif type_intrest == "quit":
            print("Exiting the program...")
            break
        else:
            print("Invalid option. Please select 'y', 'n', or 'quit'.")

if __name__ == "__main__":
    main()
