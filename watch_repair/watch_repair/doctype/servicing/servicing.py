import frappe
from frappe.model.document import Document

class Servicing(Document):
    def on_submit(self):
        # Update the status to 'Completed' upon submission
        self.db_set('status', 'Completed')
