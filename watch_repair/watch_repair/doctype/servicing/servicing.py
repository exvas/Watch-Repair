import frappe
from frappe.model.document import Document

class Servicing(Document):

    def on_submit(self):
        self.db_set('status', 'Completed')

        job_work = frappe.get_doc('Job Work', self.job_work)
        all_servicings = frappe.get_all('Servicing', filters={'job_work': self.job_work}, fields=['status'])
        statuses = [servicing['status'] for servicing in all_servicings]
        if all(status == 'Completed' for status in statuses):
            new_status = 'Servicing Completed'
        else:
            new_status = 'Working In Progress'

        if job_work.status != new_status:
            job_work.db_set('status', new_status)
        
        job_work.reload()
 