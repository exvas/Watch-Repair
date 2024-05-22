import frappe
import json

@frappe.whitelist()
def get_items(job_work_ids):
    if not job_work_ids:
        return []

    # Debugging: Print raw job_work_ids
    print(f"Raw Job Work IDs: {job_work_ids}")
    frappe.log_error(message=f"Raw Job Work IDs: {job_work_ids}", title="Job Work IDs Debug")

    # Ensure job_work_ids is a list
    if isinstance(job_work_ids, str):
        try:
            job_work_ids = json.loads(job_work_ids)  # Parse the string to a list
        except json.JSONDecodeError:
            job_work_ids = [job_work_ids]  # If it's a simple string, wrap it in a list

    # Debugging: Print parsed job_work_ids
    print(f"Parsed Job Work IDs: {job_work_ids}")
    frappe.log_error(message=f"Parsed Job Work IDs: {job_work_ids}", title="Parsed Job Work IDs Debug")

    try:
        # Fetching relevant fields from Job Work doctype based on job_work_ids
        items = frappe.db.get_all(
            'Job Work', 
            filters={'name': ['in', job_work_ids]},  # Apply filter to fetch only selected job work ids
            fields=["customer", "service_item", "qty" ,"name"]  # Add customer field here
        )
        
        # Debugging output
        print(f"Fetched items: {items}")
        frappe.log_error(message=f"Fetched items: {items}", title="Job Work Items Debug")

    except Exception as e:
        frappe.log_error(message=str(e), title="Error in fetching Job Work items")
        return []

    return items
