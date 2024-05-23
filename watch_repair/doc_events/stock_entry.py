import frappe


def on_cancel_se(doc,method):

    if doc.custom_job_work:
        frappe.db.sql("""update `tabJob Work` set status ='Servicing Completed' where name=%s""", doc.custom_job_work)
        frappe.db.sql("""update `tabJob Work` set stock_entry_status ='Stock Entry Not Created' where name=%s""", doc.custom_job_work)    
        frappe.db.commit()

        # if self.is_deleted:
        #     frappe.db.sql("""update `tabJob Work` set status='Cancelled' where name=%s""", self.custom_job_work)
        #     frappe.db.commit()