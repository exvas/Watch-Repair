import frappe
from frappe.model.document import Document

class JobWork(Document):

    def on_submit(self):
        self.db_set('status', 'Completed')

        repair_order = frappe.get_doc('Repair Order', self.repair_order)

        for item in repair_order.repair_order_item:
            if item.item == self.service_item:
                item.complaint_completion_status = 'Completed'
        repair_order.save()

        all_job_work = frappe.get_all('Job Work', filters={'repair_order': self.repair_order}, fields=['status'])

        statuses = [job_work['status'] for job_work in all_job_work]
        
        if all(status == 'Completed' for status in statuses):
            new_status = 'Completed'
        else:
            new_status = 'Working In Progress'

        if repair_order.status != new_status:
            repair_order.db_set('status', new_status)
        
        repair_order.reload()
        repair_order.save()
        
    
    def on_cancel(self):

        frappe.db.sql("""update `tabJob Work` set status='Cancelled' where name=%s""", self.name)	

        frappe.db.sql("""update `tabRepair Order` set status='Pending' where name=%s""", self.repair_order)	
        frappe.db.commit()
 

    @frappe.whitelist()
    def get_linked_data(self, customer, service_item, repair_order):
        submitted_query = """
            SELECT 
                jwi.item, 
                jwi.item_name, 
                jwi.uom,
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
    

    @frappe.whitelist()
    def create_stock_entry(self):
        pass

        # frappe.db.sql("""UPDATE `tabProject Material Usage Log` SET status= 'Approved' WHERE name=%s""",self.name)
        # frappe.db.commit()
        #     # self.reload()

        # mom = frappe.get_doc('Moms Custom Settings')

        # se = frappe.new_doc("Stock Entry")
        # se.stock_entry_type = mom.project_material_usage_log
        # # se.purpose = 'Material Transfer'
        # se.from_warehouse = self.source_warehouse
        # se.to_warehouse = self.target_warehouse
        # se.custom_project_material_usage_log = self.name
        # # se.custom_project_material_usage_log = self.project_material_request
        # # se.add_to_transit = 1

        # if self.items: 
        #     for i in self.items:
        #         se.append('items', {
        #             's_warehouse': self.source_warehouse,
        #             't_warehouse': self.target_warehouse,
        #             'item_code': i.item_code,
        #             'qty': i.qty,
        #             'uom': i.uom,
        #             'stock_uom': i.uom,
        #             'conversion_factor': i.conversion_factor,
        #             'cost_center': self.cost_center,
        #             # 'cost_center': "AMS-PRJ-2024-25-003 - AMS",
        #             'project': self.project
        #         })

        # se.insert(ignore_permissions=True)
        # se.submit()
        # frappe.msgprint("Stock Entry Created")
        

        # self.reload()
