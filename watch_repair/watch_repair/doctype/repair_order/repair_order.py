# Copyright (c) 2024, sammish and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class RepairOrder(Document):
	

	@frappe.whitelist()
	def on_submit(self):
		
		watch =frappe.get_doc('Watch Service Settings')
		if watch.auto_create_job_work:
			for item in self.get('repair_order_item'):

				mr = frappe.new_doc("Job Work")
				mr.repair_order = self.name
				mr.company = self.company
				mr.customer = self.customer
				mr.customer_name = self.customer_name
				mr.warehouse = self.warehouse

				mr.service_item = item.item
				mr.service_item_name = item.item_name
				mr.qty = item.qty
				mr.serial_no = item.serial_no
				mr.model_no = item.model_no

			
			
			mr.insert()
			mr.save()

			self.reload()
			frappe.msgprint("Job Work created successfully: {}".format(mr.name))

			return mr.name
 