# Copyright (c) 2024, sammish and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class JobWork(Document):
    
    @frappe.whitelist()
    def get_linked_data(self, customer, service_item, repair_order):
        query = """
            SELECT 
                jwi.item, 
                jwi.item_name, 
                jwi.qty, 
                jwi.available_qty, 
                jwi.valuation_rate
            FROM 
                tabJob Work Item as jwi
            INNER JOIN 
                tabServicing as s ON s.name = jwi.parent
            WHERE 
                s.docstatus = 1
                AND s.customer = %s
                AND s.item = %s
                AND s.repair_order = %s
        """
        data = frappe.db.sql(query, (customer, service_item, repair_order), as_dict=True)
        return data


