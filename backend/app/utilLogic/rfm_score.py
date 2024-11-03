import pandas as pd
import os
from datetime import datetime

def combine_segments(row):
    rfm_segment = row['RFM Segment']
    rf_segment = row['RF Segment']
    
    if rfm_segment == rf_segment:
        return rfm_segment 
    elif rfm_segment == 'Unknown' and rf_segment == 'Unknown':
        return 'Unknown'
    elif rfm_segment == 'Unknown':
        return rf_segment
    elif rf_segment == 'Unknown':
        return rfm_segment
    else:
        return f"{rfm_segment} and {rf_segment}"
engagement_strategies = {
    'Champions': "Reward these users. They promote your products, they can be early adopters for your new launches.",
    'Loyal Customers': "These users are responsive to your promotions, and you can suggest to them higher-value products. Also, ask them for reviews.",
    'Potential Loyalists': "Engage them with long-term offers like loyalty programs or membership rewards. Suggest other categories of products to them.",
    'New Customers': "For new users, make their onboarding experience smooth and provide assistance when needed.",
    'Promising': "Make them loyal by creating brand awareness and giving free trials.",
    'Need Attention': "Need to bring back these customers, provide limited-period offers, and recommend products using purchase history.",
    'About to Sleep': "The user will be lost if not reactivated. Recommend them popular products and provide discounts for memberships.",
    "Price Sensitive": "Users looking for the best deal, recommend them the highest rated products and send discount communications.",
    "Can't Lose Them": "Listen to their feedback, suggest them newer products, and make them stick to your platform.",
    'Hibernating': "Recommend products for other categories and provide personalized offers.",
    'Lost': "Make your presence known through different campaigns.",
    'Unknown': "Segment not recognized, consider re-evaluating the criteria."
}

def get_engagement_strategies(fcs):
    segments = fcs.split(' and ')
    strategies = [engagement_strategies.get(segment, 'Unknown') for segment in segments]
    return '\n'.join(strategies)

# current_dir = os.path.dirname(__file__)
# file_path = os.path.join(current_dir, 'data', 'sample.xlsx')
sheet_name = 'Orders'

# print(f"Reading data from '{file_path}'...")

def process_file(file_path):

    dir_name, original_file_name = os.path.split(file_path)

    df = pd.read_excel(file_path, sheet_name=sheet_name)

    print(f"Data successfully loaded from sheet '{sheet_name}'.")
    print(df.head())


    print("Converting 'Order Date' to datetime format...")
    df['Order Date'] = pd.to_datetime(df['Order Date'], errors='coerce')


    if df['Order Date'].isnull().any():
        print("Warning: Some 'Order Date' values could not be converted and are set as NaT.")


    today = datetime.today()

    print("Grouping data by 'Customer ID' and 'Order ID' and aggregating metrics...")
    grouped = df.groupby(['Customer ID', 'Order ID']).agg({
        'Order Date': 'max',            # Most recent order date
        'Sales': 'sum'                  # Total sales for the order
    }).reset_index()


    grouped_customer = grouped.groupby('Customer ID').agg({
        'Order Date': 'max',                      # Most recent order date
        'Order ID': 'size',                       # Count of unique Order IDs
        'Sales': 'sum'                           # Total sales across all orders
    }).reset_index()


    grouped_customer.columns = ['Customer ID', 'Order Date (Recent)', 'Total orders', 'Sales (Sum)']

    grouped_customer['Sales (Sum)'] = grouped_customer['Sales (Sum)'].apply(lambda x: round(x, 2))


    print("Calculating Recency and RFM scores...")
    grouped_customer['Recency (Days)'] = (today - grouped_customer['Order Date (Recent)']).dt.days
    grouped_customer['Frequency'] = grouped_customer['Total orders']
    grouped_customer['Monetary'] = grouped_customer['Sales (Sum)']

    def normalize(x, min_value, max_value):
        if max_value == min_value:
            return x.apply(lambda _: 3)  # Avoid division by zero, assign a default middle score
        return 1 + 4 * (x - min_value) / (max_value - min_value)

    recency_min = grouped_customer['Recency (Days)'].min()
    recency_max = grouped_customer['Recency (Days)'].max()
    frequency_min = grouped_customer['Frequency'].min()
    frequency_max = grouped_customer['Frequency'].max()
    monetary_min = grouped_customer['Monetary'].min()
    monetary_max = grouped_customer['Monetary'].max()

    grouped_customer['Recency Score'] = normalize(grouped_customer['Recency (Days)'], recency_min, recency_max).round().astype(int)
    grouped_customer['Frequency Score'] = normalize(grouped_customer['Frequency'], frequency_min, frequency_max).round().astype(int)
    grouped_customer['Monetary Score'] = normalize(grouped_customer['Monetary'], monetary_min, monetary_max).round().astype(int)

    grouped_customer['RFM Score'] = grouped_customer['Recency Score'] * 100 + grouped_customer['Frequency Score'] * 10 + grouped_customer['Monetary Score']


    grouped_customer['RF Score'] = grouped_customer['Recency Score'] * 10 + grouped_customer['Frequency Score']

    def segment_customer_rfm(row):
        r, f, m = row['Recency Score'], row['Frequency Score'], row['Monetary Score']
        
        if 4 <= r <= 5 and 4 <= f <= 5 and 4 <= m <= 5:
            return 'Champions'
        elif 2 <= r <= 4 and 3 <= f <= 4 and 4 <= m <= 5:
            return 'Loyal Customers'
        elif 3 <= r <= 5 and 1 <= f <= 3 and 1 <= m <= 3:
            return 'Potential Loyalists'
        elif 4 <= r <= 5 and r < 2 and m < 2:
            return 'New Customers'
        elif 3 <= r <= 4 and f < 2 and m < 2:
            return 'Promising'
        elif 3 <= r <= 4 and 3 <= f <= 4 and 3 <= m <= 4:
            return 'Need Attention'
        elif 2 <= r <= 3 and f < 3 and m < 3:
            return 'About to Sleep'
        elif r < 3 and 2 <= f <= 5 and 2 <= m <= 5:
            return 'Price Sensitive'
        elif r < 2 and 4 <= f <= 5 and 4 <= m <= 5:
            return "Can't Lose Them"
        elif 2 <= r <= 3 and 2 <= f <= 3 and 2 <= m <= 3:
            return 'Hibernating'
        elif r < 2 and f < 2 and m < 2:
            return 'Lost'
        else:
            return 'Unknown'


    def segment_customer_rf(row):
        r, f = row['Recency Score'], row['Frequency Score']
        
        if 4 <= r <= 5 and 4 <= f <= 5:
            return 'Champions'
        elif 2 <= r <= 4 and 3 <= f <= 4:
            return 'Loyal Customers'
        elif 3 <= r <= 5 and 1 <= f <= 3:
            return 'Potential Loyalists'
        elif 4 <= r <= 5 and f < 2:
            return 'New Customers'
        elif 3 <= r <= 4 and f < 2:
            return 'Promising'
        elif 3 <= r <= 4 and 3 <= f <= 4:
            return 'Need Attention'
        elif 2 <= r <= 3 and f < 3:
            return 'About to Sleep'
        elif r < 3 and 2 <= f <= 5:
            return 'Price Sensitive'
        elif r < 2 and 4 <= f <= 5:
            return "Can't Lose Them"
        elif 2 <= r <= 3 and 2 <= f <= 3:
            return 'Hibernating'
        elif r < 2 and f < 2:
            return 'Lost'
        else:
            return 'Unknown'


     

    
    grouped_customer['RFM Segment'] = grouped_customer.apply(segment_customer_rfm, axis=1)
    grouped_customer['RF Segment'] = grouped_customer.apply(segment_customer_rf, axis=1)

    segments_rfm = {
        'Segment': ['Champions', 'Loyal Customers', 'Potential Loyalists', 'New Customers', 'Promising', 'Need Attention', 'About to Sleep', "Price sensitive ", "Can't Lose Them", 'Hibernating', 'Lost', 'Unknown'],
        'Recency Score': ['4-5', '2-4', '3-5', '4-5', '3-4', '3-4', '2-3', '<3', '<2', '2-3', '<2', 'Various'],
        'Frequency Score': ['4-5', '3-4', '1-3', '<2', '<2', '3-4', '<3', '2-5', '4-5', '2-3', '<2', 'Various'],
        'Monetary Score': ['4-5', '4-5', '1-3', '<2', '<2', '3-4', '<3', '2-5', '4-5', '2-3', '<2', 'Various']
    }
    segment_details_rfm = pd.DataFrame(segments_rfm)

    segments_rf = {
        'Segment': ['Champions', 'Loyal Customers', 'Potential Loyalists', 'New Customers', 'Promising', 'Need Attention', 'About to Sleep', "Price sensitive ", "Can't Lose Them", 'Hibernating', 'Lost', 'Unknown'],
        'Recency Score': ['4-5', '2-4', '3-5', '4-5', '3-4', '3-4', '2-3', '<3', '<2', '2-3', '<2', 'Various'],
        'Frequency Score': ['4-5', '3-4', '1-3', '<2', '<2', '3-4', '<3', '2-5', '4-5', '2-3', '<2', 'Various']
    }
    segment_details_rf = pd.DataFrame(segments_rf)

    grouped_customer['FCS'] = grouped_customer.apply(combine_segments, axis=1)

    grouped_customer['Recommendation'] = grouped_customer['FCS'].apply(get_engagement_strategies)

    rfm_segment_counts = grouped_customer['RFM Segment'].value_counts()
    rfm_segment_percentages = rfm_segment_counts / len(grouped_customer) * 100

    rf_segment_counts = grouped_customer['RF Segment'].value_counts()
    rf_segment_percentages = rf_segment_counts / len(grouped_customer) * 100


    rfm_percentage_df = pd.DataFrame({
        'RFM Segment': rfm_segment_percentages.index,
        'Count': rfm_segment_counts.values,
        'Percentage': rfm_segment_percentages.values
    })

    rf_percentage_df = pd.DataFrame({
        'RF Segment': rf_segment_percentages.index,
        'Count': rf_segment_counts.values,
        'Percentage': rf_segment_percentages.values
    })

    rfm_total_revenue = grouped_customer.groupby('RFM Segment')['Sales (Sum)'].sum()
    rf_total_revenue = grouped_customer.groupby('RF Segment')['Sales (Sum)'].sum()

    total_revenue = grouped_customer['Sales (Sum)'].sum()

    rfm_percentage_df['Total Revenue'] = rfm_percentage_df['RFM Segment'].map(rfm_total_revenue)
    rfm_percentage_df['Percentage of Revenue'] = (rfm_percentage_df['Total Revenue'] / total_revenue * 100).round(2)

    rf_percentage_df['Total Revenue'] = rf_percentage_df['RF Segment'].map(rf_total_revenue)
    rf_percentage_df['Percentage of Revenue'] = (rf_percentage_df['Total Revenue'] / total_revenue * 100).round(2)

    required_columns = ['Percentage of Revenue', 'Total Revenue', 'Count', 'Percentage']

    total_values_rfm = {
        'RFM Segment': 'Total',
        'Count': rfm_percentage_df['Count'].sum() if'Count'in rfm_percentage_df.columns else 0,
        'Percentage': rfm_percentage_df['Percentage'].sum() if'Percentage'in rfm_percentage_df.columns else 0,
        'Total Revenue': rfm_percentage_df['Total Revenue'].sum() if'Total Revenue'in rfm_percentage_df.columns else 0,
        'Percentage of Revenue': rfm_percentage_df['Percentage of Revenue'].sum() if'Percentage of Revenue'in rfm_percentage_df.columns else 0
    }
    total_values_rfm = {k: round(v, 0) if isinstance(v, (int, float)) else v for k, v in total_values_rfm.items()}

    total_values_rf = {
        'RF Segment': 'Total',
        'Count': rf_percentage_df['Count'].sum() if'Count'in rf_percentage_df.columns else 0,
        'Percentage': rf_percentage_df['Percentage'].sum() if'Percentage'in rf_percentage_df.columns else 0,
        'Total Revenue': rf_percentage_df['Total Revenue'].sum() if'Total Revenue'in rf_percentage_df.columns else 0,
        'Percentage of Revenue': rf_percentage_df['Percentage of Revenue'].sum() if'Percentage of Revenue'in rf_percentage_df.columns else 0
    }
    total_values_rf = {k: round(v, 0) if isinstance(v, (int, float)) else v for k, v in total_values_rf.items()}


    summary_df_rfm = pd.DataFrame([total_values_rfm])
    summary_df_rf = pd.DataFrame([total_values_rf])

    empty_row_rfm = pd.DataFrame([{}])
    empty_row_rf = pd.DataFrame([{}])


    rfm_percentage_df = pd.concat([rfm_percentage_df, empty_row_rfm, summary_df_rfm], ignore_index=True)

    rf_percentage_df = pd.concat([rf_percentage_df, empty_row_rf, summary_df_rf], ignore_index=True)

    # new_file_path = os.path.join(current_dir, 'data', 'sample_results_rfm_rf.xlsx')
    new_file_name = f"processed_{original_file_name}"
    new_file_path = os.path.join(dir_name, new_file_name)

    with pd.ExcelWriter(new_file_path) as writer:
        grouped_customer.to_excel(writer, sheet_name='RFM Results', index=False)
        segment_details_rfm.to_excel(writer, sheet_name='RFM Segmentation Details', index=False)

        segment_details_rf.to_excel(writer, sheet_name='RF Segmentation Details', index=False)

        rfm_percentage_df.to_excel(writer, sheet_name='RFM Segment Percentages', index=False)

        rf_percentage_df.to_excel(writer, sheet_name='RF Segment Percentages', index=False)

    num_rows_excel = len(grouped_customer)
    print(f"Number of rows in RFM results sheet: {num_rows_excel}")

    print("Results Excel file created successfully with RFM and segmentation details.")

    return new_file_path


# except FileNotFoundError:
#     print(f"File '{file_path}' not found. Please check the file path.")

# except Exception as e:
#     print(f"An error occurred: {e}")