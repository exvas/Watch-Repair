import frappe
import json

@frappe.whitelist()
def get_items(job_work_ids):
    if not job_work_ids:
        return []

    print(f"Raw Job Work IDs: {job_work_ids}")
    frappe.log_error(message=f"Raw Job Work IDs: {job_work_ids}", title="Job Work IDs Debug")

    if isinstance(job_work_ids, str):
        try:
            job_work_ids = json.loads(job_work_ids)  
        except json.JSONDecodeError:
            job_work_ids = [job_work_ids]  

    print(f"Parsed Job Work IDs: {job_work_ids}")
    frappe.log_error(message=f"Parsed Job Work IDs: {job_work_ids}", title="Parsed Job Work IDs Debug")

    try:
        items = frappe.db.get_all(
            'Job Work', 
            filters={'name': ['in', job_work_ids]},  
            fields=["customer", "service_item", "qty" ,"name" , "service_item_name" , "uom" , "warehouse"]  
        )
        
        print(f"Fetched items: {items}")
        frappe.log_error(message=f"Fetched items: {items}", title="Job Work Items Debug")

    except Exception as e:
        frappe.log_error(message=str(e), title="Error in fetching Job Work items")
        return []

    return items

def update_job_work_status(doc, method):
    print("submit")
    for item in doc.items:
        if item.custom_name:
            try:
                job_work = frappe.get_doc("Job Work", item.custom_name)
                job_work.status = "Completed"
                job_work.save()
                frappe.db.commit()
            except Exception as e:
                frappe.log_error(message=str(e), title="Error in updating Job Work status")

def update_job_work_status_to_invoice(doc, method):
    for item in doc.items:
        if item.custom_name:
            try:
                job_work = frappe.get_doc("Job Work", item.custom_name)
                job_work.status = "To Invoice"
                job_work.save()
                frappe.db.commit()
            except Exception as e:
                frappe.log_error(message=str(e), title="Error in updating Job Work status to To Invoice")

def on_trash(doc, method):
    job_work_id = doc.custom_job_work
    if job_work_id:
        frappe.db.sql("""
    UPDATE `tabJob Work`
    SET status = 'To Invoice'
    WHERE name = %s
""", (job_work_id,))
        frappe.db.commit()




def disable_items_on_sales_invoice_submit(doc, method):
    for item in doc.items:
        item_code = item.item_code
        frappe.db.set_value('Item', item_code, 'disabled', 1)
        frappe.db.commit()  # Ensure the change is committed to the database

def enable_items_on_sales_invoice_cancel(doc, method):
    for item in doc.items:
        item_code = item.item_code
        frappe.db.set_value('Item', item_code, 'disabled', 0)
        frappe.db.commit()  # Ensure the change is committed to the database









# def update_job_work_status(doc, method):
#     print("submit")
    
#     # Loop through the items and update the status of the Job Work for each item
#     for item in doc.items:
#         if item.custom_name:
#             try:
#                 job_work = frappe.get_doc("Job Work", item.custom_name)
#                 job_work.status = "Completed"
#                 job_work.save()
#                 frappe.db.commit()
#             except Exception as e:
#                 frappe.log_error(message=str(e), title="Error in updating Job Work status")

#     # Check if the custom job work exists and update its status to 'Delivered'
#     job = doc.custom_job_work  # Use the custom job field from the document
#     if job:
#         # Check if the job exists in the Job Work Doctype
#         job_work_name = frappe.db.get_value('Job Work', {'name': job}, 'name')
        
#         if job_work_name:
#             # Update the status of the Job Work entry
#             frappe.db.sql("""UPDATE `tabJob Work` SET status = 'Delivered' WHERE name = %s""", job_work_name)
#             frappe.db.commit()

