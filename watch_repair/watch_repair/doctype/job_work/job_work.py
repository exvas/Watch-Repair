import frappe
from frappe.model.document import Document

class JobWork(Document):

    def on_submit(self):
        self.db_set('status', 'Completed')

        repair_order = frappe.get_doc('Repair Order', self.repair_order)

        all_job_work = frappe.get_all('Job Work', filters={'repair_order': self.repair_order}, fields=['status'])

        statuses = [job_work['status'] for job_work in all_job_work]
        
        if all(status == 'Completed' for status in statuses):
            new_status = 'Completed'
        else:
            new_status = 'Working In Progress'

        if repair_order.status != new_status:
            repair_order.db_set('status', new_status)
        
        repair_order.reload()



    @frappe.whitelist()
    def get_linked_data(self, customer, service_item, repair_order):
        submitted_query = """
            SELECT 
                jwi.item, 
                jwi.item_name, 
                jwi.qty, 
                jwi.available_qty, 
                jwi.valuation_rate
            FROM 
                `tabJob Work Item` as jwi
            INNER JOIN 
                `tabServicing` as s ON s.name = jwi.parent
            WHERE 
                s.docstatus = 1
                AND s.customer = %s
                AND s.item = %s
                AND s.repair_order = %s
        """
        submitted_data = frappe.db.sql(submitted_query, (customer, service_item, repair_order), as_dict=True)
        
        unsubmitted_query = """
            SELECT name 
            FROM `tabServicing`
            WHERE docstatus = 0
            AND customer = %s
            AND item = %s
            AND repair_order = %s
        """
        unsubmitted_data = frappe.db.sql(unsubmitted_query, (customer, service_item, repair_order), as_dict=True)

        return {
            "submitted_data": submitted_data,
            "unsubmitted_data": unsubmitted_data
        }
 