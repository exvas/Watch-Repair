import frappe
from frappe.model.document import Document 

class JobWork(Document):



    def on_submit(self):

        watch =frappe.get_doc('Watch Service Settings')

        if watch.auto_create_stock_entry:
            

            if self.is_free_service:

                if self.job_work_item:
                    frappe.db.sql("""UPDATE `tabJob Work` SET stock_entry_status= 'Stock Entry Created' WHERE name=%s""", self.name)
                    frappe.db.sql("""UPDATE `tabJob Work` SET status= 'To Invoice' WHERE name=%s""", self.name)
                    frappe.db.commit()
                    self.reload()

                    se = frappe.new_doc("Stock Entry")
                    se.stock_entry_type = watch.stock_entry_with_service_materials
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
                                'qty': i.qty,
                                'uom': i.uom,
                                'stock_uom': i.uom,
                                'conversion_factor': 1,
                            })

                        # Append the service item
                        se.append('items', {
                            'item_code': self.service_item,
                            't_warehouse': self.warehouse,
                            'qty': self.qty,
                            'uom': self.uom,
                            'stock_uom': self.uom,
                            'conversion_factor': 1,
                            'is_finished_item': 1
                        })

                    se.insert(ignore_permissions=True)
                    se.save()
                    se.submit()
                    print("Free Service Manufacturing Stock Entry Created ")
                    frappe.msgprint("Free Service Manufacturing Stock Entry Created")

                    self.reload()

                else:

                    frappe.db.sql("""UPDATE `tabJob Work` SET stock_entry_status= 'Stock Entry Created' WHERE name=%s""", self.name)
                    frappe.db.sql("""UPDATE `tabJob Work` SET status= 'To Invoice' WHERE name=%s""", self.name)
                    frappe.db.commit()
                    self.reload()

                    se = frappe.new_doc("Stock Entry")
                    se.stock_entry_type = watch.stock_entry_without_service_materials
                    se.to_warehouse = self.warehouse
                    se.custom_job_work = self.name
                    se.set_posting_time = 1
                    se.posting_date = self.posting_date
                    se.posting_time = self.posting_time
                    

                    se.append('items', {
                        'item_code': self.service_item,
                        't_warehouse': self.warehouse,
                        'qty': self.qty,
                        'uom': self.uom,
                        'stock_uom': self.uom,
                        'conversion_factor': 1,
                        'allow_zero_valuation_rate': 1,
                    })

                    se.insert(ignore_permissions=True)
                    se.save()
                    se.submit()
                    frappe.msgprint("Stock Entry Created")

                    self.reload()

                

            

            elif self.service_only:
                frappe.db.sql("""UPDATE `tabJob Work` SET stock_entry_status= 'Stock Entry Created' WHERE name=%s""", self.name)
                frappe.db.sql("""UPDATE `tabJob Work` SET status= 'To Invoice' WHERE name=%s""", self.name)
                frappe.db.commit()
                self.reload()

                se = frappe.new_doc("Stock Entry")
                se.stock_entry_type = watch.stock_entry_without_service_materials
                se.to_warehouse = self.warehouse
                se.custom_job_work = self.name
                se.set_posting_time = 1
                se.posting_date = self.posting_date
                se.posting_time = self.posting_time

                se.append('items', {
                    'item_code': self.service_item,
                    't_warehouse': self.warehouse,
                    'qty': self.qty,
                    'uom': self.uom,
                    'stock_uom': self.uom,
                    'conversion_factor': 1,
                    'basic_rate': self.service_cost,
                })

                se.insert(ignore_permissions=True)
                se.save()
                se.submit()
                frappe.msgprint("Stock Entry Created")

                self.reload()

            elif self.add_additional_cost:

                if self.job_work_item:
                    frappe.db.sql("""UPDATE `tabJob Work` SET stock_entry_status= 'Stock Entry Created' WHERE name=%s""", self.name)
                    frappe.db.sql("""UPDATE `tabJob Work` SET status= 'To Invoice' WHERE name=%s""", self.name)
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
                    se.append('additional_costs', {
                        'expense_account': self.expense_account,
                        'description': self.description,
                        'amount': self.additional_cost,
                    })

                    if self.job_work_item:
                        for i in self.job_work_item:
                            se.append('items', {
                                'item_code': i.item,
                                's_warehouse': self.warehouse,
                                'qty': i.qty,
                                'uom': i.uom,
                                'stock_uom': i.uom,
                                'conversion_factor': 1,
                            })

                        # Append the service item
                        se.append('items', {
                            'item_code': self.service_item,
                            't_warehouse': self.warehouse,
                            'qty': self.qty,
                            'uom': self.uom,
                            'stock_uom': self.uom,
                            'conversion_factor': 1,
                            'is_finished_item': 1
                        })

                    se.insert(ignore_permissions=True)
                    se.save()
                    se.submit()
                    frappe.msgprint("Stock Entry Created")

                    self.reload()

                

                else:

                    frappe.db.sql("""UPDATE `tabJob Work` SET stock_entry_status= 'Stock Entry Created' WHERE name=%s""", self.name)
                    frappe.db.sql("""UPDATE `tabJob Work` SET status= 'To Invoice' WHERE name=%s""", self.name)
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
                    se.append('additional_costs', {
                        'expense_account': self.expense_account,
                        'description': self.description,
                        'amount': self.additional_cost,
                    })

                    # if self.job_work_item:
                    #     for i in self.job_work_item:
                    #         se.append('items', {
                    #             'item_code': i.item,
                    #             's_warehouse': self.warehouse,
                    #             't_warehouse': self.warehouse,
                    #             'qty': i.qty,
                    #             'uom': i.uom,
                    #             'stock_uom': i.uom,
                    #             'conversion_factor': 1,
                    #         })
                    # else:
                    se.append('items', {
                        'item_code': self.service_item,
                        's_warehouse': self.warehouse,
                        't_warehouse': self.warehouse,
                        'qty': self.qty,
                        'uom': self.uom,
                        'stock_uom': self.uom,
                        'conversion_factor': 1,
                    })

                    se.insert(ignore_permissions=True)
                    se.save()
                    se.submit()
                    frappe.msgprint("Stock Entry Created")

                    self.reload()


        # self.db_set('status', 'To Stock Entry')

        repair_order = frappe.get_doc('Repair Order', self.repair_order)

        for item in repair_order.repair_order_item:
            if item.item == self.service_item:
                if self.status == 'Completed':
                    item.complaint_completion_status = 'Completed'
                elif self.status == 'Return':
                    item.complaint_completion_status = 'Return'
        repair_order.save()


        repair_order = frappe.get_doc('Repair Order', self.repair_order)

        complaint_completion_statuses = [item.complaint_completion_status for item in repair_order.repair_order_item]

        if all(status == 'Completed' for status in complaint_completion_statuses):
            new_status = 'Completed'
        elif 'Return' in complaint_completion_statuses and 'Completed' in complaint_completion_statuses:
            new_status = 'Completed'
        else:
            if self.status == 'To Invoice':
                new_status = 'Working In Progress'

            elif self.status == 'Return':
                new_status = 'Completed'
            else:
                # self.status == 'Completed'
                new_status = 'Completed'

        if repair_order.status != new_status:
            repair_order.db_set('status', new_status)

        repair_order.reload()
        repair_order.save()
                
    
    def on_cancel(self):

        frappe.db.sql("""update `tabJob Work` set status='Cancelled' where name=%s""", self.name)	

        frappe.db.sql("""update `tabRepair Order` set status='Pending' where name=%s""", self.repair_order)	
        frappe.db.commit()
 


# get service material from servicing ----------------------------

    @frappe.whitelist()
    def get_linked_data(self, customer, service_item, repair_order):

        if self.is_return == 1 and self.status == 'Return':
                repair_order = frappe.get_doc('Repair Order', self.repair_order)

                all_completed = True
                for item in repair_order.repair_order_item:
                    if item.item == self.service_item:
                        if self.is_return and self.status == 'Return':
                            item.complaint_completion_status = 'Return'
                    
                    if item.complaint_completion_status != 'Completed':
                        all_completed = False

                repair_order.save()
                frappe.db.sql("""UPDATE `tabJob Work` SET status= 'Return' WHERE name=%s""", self.name)
                frappe.db.commit()

                if all_completed:
                    repair_order_status = 'Completed'
                    for item in repair_order.repair_order_item:
                        if item.complaint_completion_status == 'Return':
                            repair_order_status = 'Completed'
                            break
                        elif item.complaint_completion_status != 'Completed':
                            repair_order_status = 'Work In Progress'
                            

                    repair_order.status = repair_order_status
                    repair_order.save()
                    frappe.db.commit()

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
    
    
#############################################################################################
########################     Button wise Stock Entry creation    #############################
#############################################################################################    

    @frappe.whitelist()
    def create_stock_entry(self):
        watch = frappe.get_doc('Watch Service Settings')

        # if Service only Stock Entry Creation
        if self.is_free_service:

            if self.job_work_item:
                frappe.db.sql("""UPDATE `tabJob Work` SET stock_entry_status= 'Stock Entry Created' WHERE name=%s""", self.name)
                frappe.db.sql("""UPDATE `tabJob Work` SET status= 'To Invoice' WHERE name=%s""", self.name)
                frappe.db.commit()
                self.reload()

                se = frappe.new_doc("Stock Entry")
                se.stock_entry_type = watch.stock_entry_with_service_materials
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
                            'qty': i.qty,
                            'uom': i.uom,
                            'stock_uom': i.uom,
                            'conversion_factor': 1,
                        })

                    # Append the service item
                    se.append('items', {
                        'item_code': self.service_item,
                        't_warehouse': self.warehouse,
                        'qty': self.qty,
                        'uom': self.uom,
                        'stock_uom': self.uom,
                        'conversion_factor': 1,
                        'is_finished_item': 1
                    })

                se.insert(ignore_permissions=True)
                se.save()
                se.submit()
                frappe.msgprint("Stock Entry Created")

                self.reload()

            else:

                frappe.db.sql("""UPDATE `tabJob Work` SET stock_entry_status= 'Stock Entry Created' WHERE name=%s""", self.name)
                frappe.db.sql("""UPDATE `tabJob Work` SET status= 'To Invoice' WHERE name=%s""", self.name)
                frappe.db.commit()
                self.reload()

                se = frappe.new_doc("Stock Entry")
                se.stock_entry_type = watch.stock_entry_without_service_materials
                se.to_warehouse = self.warehouse
                se.custom_job_work = self.name
                se.set_posting_time = 1
                se.posting_date = self.posting_date
                se.posting_time = self.posting_time
                

                se.append('items', {
                    'item_code': self.service_item,
                    't_warehouse': self.warehouse,
                    'qty': self.qty,
                    'uom': self.uom,
                    'stock_uom': self.uom,
                    'conversion_factor': 1,
                    'allow_zero_valuation_rate': 1,
                })

                se.insert(ignore_permissions=True)
                se.save()
                se.submit()
                frappe.msgprint("Stock Entry Created")

                self.reload()

            

        

        elif self.service_only:
            frappe.db.sql("""UPDATE `tabJob Work` SET stock_entry_status= 'Stock Entry Created' WHERE name=%s""", self.name)
            frappe.db.sql("""UPDATE `tabJob Work` SET status= 'To Invoice' WHERE name=%s""", self.name)
            frappe.db.commit()
            self.reload()

            se = frappe.new_doc("Stock Entry")
            se.stock_entry_type = watch.stock_entry_without_service_materials
            se.to_warehouse = self.warehouse
            se.custom_job_work = self.name
            se.set_posting_time = 1
            se.posting_date = self.posting_date
            se.posting_time = self.posting_time

            se.append('items', {
                'item_code': self.service_item,
                't_warehouse': self.warehouse,
                'qty': self.qty,
                'uom': self.uom,
                'stock_uom': self.uom,
                'conversion_factor': 1,
                'basic_rate': self.service_cost,
            })

            se.insert(ignore_permissions=True)
            se.save()
            se.submit()
            frappe.msgprint("Stock Entry Created")

            self.reload()

        elif self.add_additional_cost:
            frappe.db.sql("""UPDATE `tabJob Work` SET stock_entry_status= 'Stock Entry Created' WHERE name=%s""", self.name)
            frappe.db.sql("""UPDATE `tabJob Work` SET status= 'To Invoice' WHERE name=%s""", self.name)
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
            se.append('additional_costs', {
                'expense_account': self.expense_account,
                'description': self.description,
                'amount': self.additional_cost,
            })

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
                    })
            else:
                se.append('items', {
                    'item_code': self.service_item,
                    's_warehouse': self.warehouse,
                    't_warehouse': self.warehouse,
                    'qty': self.qty,
                    'uom': self.uom,
                    'stock_uom': self.uom,
                    'conversion_factor': 1,
                })

            se.insert(ignore_permissions=True)
            se.save()
            se.submit()
            frappe.msgprint("Stock Entry Created")

            self.reload()

        else:
            # Manufacturing Stock Entry Creation
            frappe.db.sql("""UPDATE `tabJob Work` SET stock_entry_status= 'Stock Entry Created' WHERE name=%s""", self.name)
            frappe.db.sql("""UPDATE `tabJob Work` SET status= 'To Invoice' WHERE name=%s""", self.name)
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
                        'qty': i.qty,
                        'uom': i.uom,
                        'stock_uom': i.uom,
                        'conversion_factor': 1,
                    })

                # Append the service item
                se.append('items', {
                    'item_code': self.service_item,
                    't_warehouse': self.warehouse,
                    'qty': self.qty,
                    'uom': self.uom,
                    'stock_uom': self.uom,
                    'conversion_factor': 1,
                    'is_finished_item': 1
                })

            se.insert(ignore_permissions=True)
            se.save()
            se.submit()
            frappe.msgprint("Stock Entry Created")

            self.reload()



#################################################################################
# Create Sales Invoice -------------------------

    @frappe.whitelist()
    def create_sales_invoice(self):

        frappe.db.sql("""UPDATE `tabJob Work` SET status= 'Completed' WHERE name=%s""",self.name)
        frappe.db.commit()

        sales_inv = frappe.new_doc("Sales Invoice")

        sales_inv.customer = self.customer
        sales_inv.set_posting_time = 1
        # sales_inv.due_date = self.posting_date
        sales_inv.custom_job_work = self.name
        sales_inv.set_warehouse = self.warehouse
        sales_inv.append('items', {
                        'item_code':self.service_item,
                        'qty':self.qty,
                        'uom':self.uom,
                        'custom_name':self.name,
                    })

       

        sales_inv.insert(ignore_permissions=True)
        sales_inv.save()
        frappe.msgprint("Sales Invoice Created")

        

        repair_order = frappe.get_doc('Repair Order', self.repair_order)

        for item in repair_order.repair_order_item:
            if item.item == self.service_item:
               item.complaint_completion_status = 'Completed'
                
        repair_order.save()


        repair_order = frappe.get_doc('Repair Order', self.repair_order)

        complaint_completion_statuses = [item.complaint_completion_status for item in repair_order.repair_order_item]

        if all(status == 'Completed' for status in complaint_completion_statuses):
            new_status = 'Completed'
        elif 'Return' in complaint_completion_statuses and 'Completed' in complaint_completion_statuses:
            new_status = 'Completed'
        else:
            if self.status == 'To Invoice':
                new_status = 'Working In Progress'

            elif self.status == 'Return':
                new_status = 'Completed'
            else:
                # self.status == 'Completed'
                new_status = 'Completed'

        if repair_order.status != new_status:
            repair_order.db_set('status', new_status)

        repair_order.reload()
        repair_order.save()



 # service Warranty creation --------------------------------------       
    
    @frappe.whitelist()
    def create_service_warranty(self):
        # frappe.msgprint("hiiii")

        frappe.db.sql("""UPDATE `tabJob Work` SET service_warranty= 'Under Warranty' WHERE name=%s""",self.name)
        frappe.db.commit()

        ser_wty = frappe.new_doc("Service Warranty")

        ser_wty.customer = self.customer
        ser_wty.item = self.service_item
        ser_wty.qty = self.qty

        repair_order_items = frappe.get_all('Repair Order Item', filters={'parent': self.repair_order}, fields=['serial_no', 'model_no'])

        for item in repair_order_items:
            ser_wty.serial_no= item.serial_no
            ser_wty.model_no= item.model_no

        ser_wty.insert(ignore_permissions=True)
        ser_wty.save()
        frappe.msgprint("Service Warranty Created")

    
    @frappe.whitelist()
    def isreturn(self):

        if self.is_return == 1:
            
            service = frappe.db.get_value("Servicing", {"job_work": self.name}, "name")

            if service:
                serv = frappe.get_doc("Servicing",service)

                if serv.docstatus == 0:
                    frappe.delete_doc("Servicing", service)
                    return "Servicing Deleted"
                    # frappe.msgprint("Servicing Deleted")
                self.save()
                self.reload()

            # frappe.db.sql("""UPDATE `tabJob Work` SET status='Return' WHERE name=%s""", self.name)

            # # frappe.db.sql("""UPDATE `tabJob Work` SET return_reason = %s WHERE name=%s""",(return_reason, self.name))
            
            # frappe.db.commit()
        
            
            
                
        
