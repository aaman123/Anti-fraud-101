import os
import warnings
import numpy as np
import pandas as pd
from pandas import Series, DataFrame
import seaborn as sns
import matplotlib.pyplot as plt
from termcolor import colored as cl
import datetime

data = pd.read_csv("../sample_files/transactional-sample.csv")

Total_transactions = len(data)
normal = len(data[data.has_cbk == False])
fraudulent = len(data[data.has_cbk == True])
fraud_percentage = round(fraudulent/normal * 100 / 2)
print(cl('Total number of Trnsactions are {}'.format(Total_transactions), attrs = ['bold']))
print(cl('Number of Normal Transactions are {}'.format(normal), attrs = ['bold']))
print(cl('Number of fraudulent Transactions are {}'.format(fraudulent), attrs = ['bold']))
print(cl('Percentage of fraud Transactions is {}'.format(fraud_percentage), attrs = ['bold']))
LABELS = ["Normal", "Fraud"]
fraud = data[data.has_cbk == True]
normal = data[data.has_cbk == False]

'''
UNCOMMENT TO PRINT STATISTIC ABOUT EACH CLASS.

print(fraud.shape, normal.shape)
print(fraud.transaction_amount.describe())
print(normal.transaction_amount.describe())
'''

'''
UNCOMMENT TO PLOT BAR CHART (NORMAL VS FRAUD )

count_classes = pd.value_counts(data['has_cbk'], sort = True)
count_classes.plot(kind = 'bar', rot=0)
plt.title("Transaction Class Distribution")
plt.xticks(range(2), LABELS)
plt.xlabel("Class")
plt.ylabel("Frequency")
plt.show()
'''

'''
UNCOMMENT TO PLOT BAR CHART ( AMOUNT VS CLASS )

f, (ax1, ax2) = plt.subplots(2, 1, sharex=True)
f.suptitle('Amount per transaction by class')
bins = 50
ax1.hist(fraud.transaction_amount, bins = bins)
ax1.set_title('Fraud')
ax2.hist(normal.transaction_amount, bins = bins)
ax2.set_title('Normal')
plt.xlabel('Amount ($)')
plt.ylabel('Number of Transactions')
plt.xlim((0, 10000))
plt.yscale('log')
plt.show()
'''

'''
UNCOMMENT TO PLOT SCATTER ( DAY VS CLASS )

f, (ax1, ax2) = plt.subplots(2, 1, sharex=True)
f.suptitle('Day of transaction vs Amount by class')
ax1.scatter(pd.to_datetime(fraud['transaction_date']).dt.date, fraud.transaction_amount)
ax1.set_title('Fraud')
ax2.scatter(pd.to_datetime(normal['transaction_date']).dt.date, normal.transaction_amount)
ax2.set_title('Normal')
plt.xlabel('Time')
plt.ylabel('Amount')
plt.show()
'''
