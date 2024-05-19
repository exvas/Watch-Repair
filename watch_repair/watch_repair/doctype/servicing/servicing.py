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



    @frappe.whitelist()
    def get_item(self,item):
        if not self.warehouse:
            frappe.throw("Please specify a Warehouse.")

        warehouse = self.warehouse
        bin_entries = frappe.get_all("Bin",
                                     filters={
                                    "item_code": item ,
                                    "warehouse": warehouse
                                },
                                fields=["actual_qty", "valuation_rate"],
                                limit=1)
        
        if not bin_entries:
            frappe.throw(f"No Stock {item} Item in {warehouse} Warehouse.")
                            
        print("xxxx",bin_entries)

        if bin_entries:
            available_qty = bin_entries[0].actual_qty 
            if available_qty > 0:
                valuation_rate = bin_entries[0].valuation_rate
                self.append("job_work_item",{
                    "available_qty":available_qty,
                    "valuation_rate":valuation_rate
                })
        