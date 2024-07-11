import frappe
from frappe.model.document import Document
 
class Servicing(Document):
 
 
    def on_submit(self):
        self.db_set('status', 'Completed')

        repair_order = frappe.get_doc('Repair Order', self.repair_order)

        for item in repair_order.repair_order_item:
            if item.item == self.item:
                item.complaint_completion_status = 'Work Completed'
        repair_order.save()

        job_work = frappe.get_doc('Job Work', self.job_work)

        all_servicings = frappe.get_all('Servicing', filters={'job_work': self.job_work}, fields=['status'])

        statuses = [servicing['status'] for servicing in all_servicings]
        
        if all(status == 'Work Completed' for status in statuses):
            new_status = 'Servicing Completed'
        else:
            new_status = 'Working In Progress'

        if job_work.status != new_status:
            job_work.db_set('status', new_status)
        
        job_work.reload()


    def on_cancel(self):

        frappe.db.sql("""update `tabServicing` set status='Cancelled' where name=%s""", self.name)	

        frappe.db.sql("""update `tabJob Work` set status='Pending' where name=%s""", self.job_work)	
        frappe.db.commit()

# //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
            frappe.throw(f"{item} Item was no quantity available in {warehouse} Warehouse.")
                            
        if bin_entries:
            print("xxxx",bin_entries)
        return bin_entries
    

# ////////////////////////////////////////////////////////////////////////////////////////////////////
        # if bin_entries:
        #     available_qty = bin_entries[0].actual_qty 
        #     if available_qty > 0:
        #         valuation_rate = bin_entries[0].valuation_rate
        #         self.append("job_work_item",{
        #             "available_qty":available_qty,
        #             "valuation_rate":valuation_rate
        #         })

    @frappe.whitelist()
    def close(self):

        doc = frappe.get_doc("Servicing", self.name)
        doc.submit()
        frappe.db.sql("""UPDATE `tabServicing` SET status='Closed' WHERE name=%s""", self.name)
        frappe.db.commit()
        self.reload()

# //////////////////////////////////////////////////////////////////////////////////////////////////////////





# custom_app/custom_app/doctype/job_work_item/job_work_item.py
# custom_app/custom_app/doctype/job_work_item/job_work_item.py
# import frappe

# @frappe.whitelist()
# def get_item_groups(item):
#     categories = []
#     item_group_doc = frappe.get_doc('Watch Service Settings', item)
#     if item_group_doc and item_group_doc.group:
#         for entry in item_group_doc.group:
#             categories.append(entry.item_group)
#     return categories

