class BankAccount:
    def __init__(self, account_num):
        self.account_num = account_num
        self.balance = 0

    def get_balance(self):
        print("The amount avaliable in your account is : {} /-".format(self.balance))

    def withdraw(self, amount):
        if self.balance >= amount:
            self.balance -= amount
        else:
            print("Insufficient Funds")

    def deposit(self, amount):
        self.balance += amount



def transfer_amount(acc_1, acc_2, amount):
    acc_1.withdraw(amount)
    acc_2.deposit(amount)


Username_01 = BankAccount("001")
Username_02 = BankAccount("002")

Username_01.deposit(250)
Username_02.deposit(50)

transfer_amount(Username_01, Username_02, 50)