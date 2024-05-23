# Copyright (c) 2024, sammish and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import today

class ServiceWarranty(Document):
	def update_warranty_status():
		warranty_records = frappe.get_all('Service Warranty', 
										filters={'warranty_expiry_date': today()},
										fields=['name', 'warranty_status'])

		for record in warranty_records:
			doc = frappe.get_doc('Service Warranty', record['name'])
			doc.warranty_status = 'Out of Warranty'
			doc.save(ignore_permissions=True)  
			frappe.db.commit()