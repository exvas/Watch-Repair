import frappe
from frappe.model.document import Document

class JobWork(Document):

    def on_submit(self):


        watch =frappe.get_doc('Watch Service Settings')
 
        if watch.auto_create_stock_entry:

            if self.service_only:

                frappe.db.sql("""UPDATE `tabJob Work` SET stock_entry_status= 'Stock Entry Created' WHERE name=%s""",self.name)
                frappe.db.sql("""UPDATE `tabJob Work` SET status= 'To Invoice' WHERE name=%s""",self.name)
                frappe.db.commit()
                self.reload()


                se = frappe.new_doc("Stock Entry")
                se.stock_entry_type = watch.stock_entry_without_service_materials
                se.from_warehouse = self.warehouse
                se.to_warehouse = self.warehouse
                se.custom_job_work = self.name
                se.set_posting_time = 1
                se.posting_date = self.posting_date
                se.posting_time = self.posting_time

                # if self.job_work_item: 
                #     for i in self.job_work_item:
                se.append('items', {
                    'item_code': self.service_item,
                    's_warehouse': self.warehouse,
                    't_warehouse': self.warehouse,
                    
                    'qty': self.qty,
                    'uom': self.uom,
                    'stock_uom': self.uom,
                    'conversion_factor': 1,
                    # 'cost_center': self.cost_center,
                    # 'project': self.project
                })

                se.insert(ignore_permissions=True)
                se.save()
                frappe.msgprint("Stock Entry Created")
                    

                self.reload()
            else:

                frappe.db.sql("""UPDATE `tabJob Work` SET stock_entry_status= 'Stock Entry Created' WHERE name=%s""",self.name)
                frappe.db.sql("""UPDATE `tabJob Work` SET status= 'To Invoice' WHERE name=%s""",self.name)
                frappe.db.commit()
                self.reload()

                se = frappe.new_doc("Stock Entry")
                se.stock_entry_type = watch.stock_entry_with_service_materials
                se.from_warehouse = self.warehouse
                se.to_warehouse = self.warehouse
                se.custom_job_work = self.name
                se.set_posting_time = 1
                se.posting_date = self.posting_date
                se.posting_time = self.posting_time

                if self.job_work_item: 
                    for i in self.job_work_item:
                        se.append('items', {
                            'item_code': i.item,
                            's_warehouse': self.warehouse,
                            't_warehouse': self.warehouse,
                            
                            'qty': i.qty,
                            'uom': i.uom,
                            'stock_uom': i.uom,
                            'conversion_factor': 1,
                            # 'cost_center': self.cost_center,
                            # 'project': self.project
                        })

                se.insert(ignore_permissions=True)
                se.save()
                frappe.msgprint("Stock Entry Created")
                    

                self.reload()

        

        # self.db_set('status', 'To Stock Entry')

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
        
        watch =frappe.get_doc('Watch Service Settings')
 
        # if watch.auto_create_stock_entry:

        if self.service_only:

            frappe.db.sql("""UPDATE `tabJob Work` SET stock_entry_status= 'Stock Entry Created' WHERE name=%s""",self.name)
            frappe.db.sql("""UPDATE `tabJob Work` SET status= 'To Invoice' WHERE name=%s""",self.name)
            frappe.db.commit()
            self.reload()


            se = frappe.new_doc("Stock Entry")
            se.stock_entry_type = watch.stock_entry_without_service_materials
            se.from_warehouse = self.warehouse
            se.to_warehouse = self.warehouse
            se.custom_job_work = self.name
            se.set_posting_time = 1
            se.posting_date = self.posting_date
            se.posting_time = self.posting_time

            # if self.job_work_item: 
            #     for i in self.job_work_item:
            se.append('items', {
                'item_code': self.service_item,
                's_warehouse': self.warehouse,
                't_warehouse': self.warehouse,
                
                'qty': self.qty,
                'uom': self.uom,
                'stock_uom': self.uom,
                'conversion_factor': 1,
                # 'cost_center': self.cost_center,
                # 'project': self.project
            })

            se.insert(ignore_permissions=True)
            se.save()
            frappe.msgprint("Stock Entry Created")
                

            self.reload()
        else:

            frappe.db.sql("""UPDATE `tabJob Work` SET stock_entry_status= 'Stock Entry Created' WHERE name=%s""",self.name)
            frappe.db.sql("""UPDATE `tabJob Work` SET status= 'To Invoice' WHERE name=%s""",self.name)
            frappe.db.commit()
            self.reload()

            se = frappe.new_doc("Stock Entry")
            se.stock_entry_type = watch.stock_entry_with_service_materials
            se.from_warehouse = self.warehouse
            se.to_warehouse = self.warehouse
            se.custom_job_work = self.name
            se.set_posting_time = 1
            se.posting_date = self.posting_date
            se.posting_time = self.posting_time

            if self.job_work_item: 
                for i in self.job_work_item:
                    se.append('items', {
                        'item_code': i.item,
                        's_warehouse': self.warehouse,
                        't_warehouse': self.warehouse,
                        
                        'qty': i.qty,
                        'uom': i.uom,
                        'stock_uom': i.uom,
                        'conversion_factor': 1,
                        # 'cost_center': self.cost_center,
                        # 'project': self.project
                    })

            se.insert(ignore_permissions=True)
            se.save()
            frappe.msgprint("Stock Entry Created")
                

            self.reload()


    @frappe.whitelist()
    def create_sales_invoice(self):

        frappe.db.sql("""UPDATE `tabJob Work` SET status= 'Completed' WHERE name=%s""",self.name)
        frappe.db.commit()

        sales_inv = frappe.new_doc("Sales Invoice")

        sales_inv.customer = self.customer
        sales_inv.set_posting_time = 1
        sales_inv.due_date = self.posting_date
        sales_inv.custom_job_work = self.name
        sales_inv.append('items', {
                        'item_code':self.service_item,
                        'qty':self.qty,
                        'uom':self.uom
                    })

        # if self.job_work_item: 
        #         for i in self.job_work_item:
        #             sales_inv.append('items', {
        #                 'item_code':i.item,
        #                 'qty':i.qty,
        #                 'uom':i.uom
        #             })
        # else:
        #     frappe.msgprint("No Service Materials Available")

        sales_inv.insert(ignore_permissions=True)
        sales_inv.save()

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
        repair_order.save()
