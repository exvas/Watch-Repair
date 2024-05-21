import frappe

@frappe.whitelist()
def get_items(job_work_ids):
    items = []
    if isinstance(job_work_ids, list):
        for job_work_id in job_work_ids:
            job_work = frappe.get_doc('Job Work', job_work_id)
            print("aaaaa",job_work)
            if job_work.service_item:
                items.append({
                    'item_code': job_work.service_item,
                    'qty': 1  # Assuming a default quantity of 1, adjust as necessary
                })
    return items
    
