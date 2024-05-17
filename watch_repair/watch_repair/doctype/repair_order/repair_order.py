# Copyright (c) 2024, sammish and contributors
# For license information, please see license.txt

import frappe
from frappe.utils import today
from frappe.model.document import Document

class RepairOrder(Document):
	

	@frappe.whitelist()
	def on_submit(self):

		frappe.db.sql("""UPDATE `tabRepair Order` SET job_work_status='Not Completed',servicing_status = 'Not Completed' WHERE name=%s""", self.name)
		frappe.db.commit()
		 

		
		watch =frappe.get_doc('Watch Service Settings')
		if watch.auto_create_job_work:

			frappe.db.sql("""UPDATE `tabRepair Order` SET job_work_status='Completed' WHERE name=%s""", self.name)
			frappe.db.commit()

			for item in self.repair_order_item:
				

				jw = frappe.new_doc("Job Work")
				jw.repair_order = self.name
				jw.company = self.company
				jw.customer = self.customer
				jw.customer_name = self.customer_name
				jw.warehouse = self.warehouse

				jw.service_item = item.item
				jw.service_item_name = item.item_name
				jw.qty = item.qty
				jw.serial_no = item.serial_no
				jw.model_no = item.model_no

			
			
				jw.insert()
				jw.save()

			self.reload()
			frappe.msgprint(" Job Work created successfully ")

		# 	return jw.name
		

		if watch.auto_create_servicing:
			frappe.db.sql("""UPDATE `tabRepair Order` SET servicing_status='Completed' WHERE name=%s""", self.name)
			frappe.db.commit()

			for item in self.repair_order_item:
				for checkbox in ["polishing", "pin_and_tube", "loop_with_screw", "push_pin", "clasp", "bra_links",
								"movement", "service", "crown", "crystal", "dial", "hands", "case", "welding",
								"drilling", "glass_decor", "anchor", "b_gasket", "bezel", "bracelet", "strap",
								"battery", "checking_time_day__date", "stopped", "polish", "other", "module",
								"pusher", "case_back", "casing_ring", "case_tube", "case_back_screw", "dial_ring",
								"middle_part_of_case", "bezel_screw", "g_gasket", "cb_gasket", "back_washer", "crown_seal"]:
					
					if item.get(checkbox):  

						Serv = frappe.new_doc("Servicing")
						Serv.repair_order = self.name
						Serv.company = self.company
						Serv.customer = self.customer
						Serv.customer_name = self.customer_name
						Serv.warehouse = self.warehouse
						Serv.posting_date = today()

						Serv.item = item.item
						Serv.service_item_name = item.item_name
						Serv.qty = item.qty
						Serv.serial_no = item.serial_no
						Serv.model_no = item.model_no
						# Serv.complaint_details = item.
						Serv.checkbox = checkbox  

						Serv.insert()
						Serv.save()

			self.reload()
			frappe.msgprint("Servicing created successfully")

		# 	return Serv.name
		
		# return jw.name
		




	# 	if watch.auto_create_servicing:
	# 		frappe.db.sql("""UPDATE `tabRepair Order` SET servicing_status='Completed' WHERE name=%s""", self.name)
	# 		frappe.db.commit()

	# 		checkboxes = [
	# 			"polishing", "pin_and_tube", "loop_with_screw", "push_pin", "clasp", "bra_links",
	# 			"movement", "service", "crown", "crystal", "dial", "hands", "case", "welding",
	# 			"drilling", "glass_decor", "anchor", "b_gasket", "bezel", "bracelet", "strap",
	# 			"battery", "checking_time_day__date", "stopped", "polish", "other", "module",
	# 			"pusher", "case_back", "casing_ring", "case_tube", "case_back_screw", "dial_ring",
	# 			"middle_part_of_case", "bezel_screw", "g_gasket", "cb_gasket", "back_washer", "crown_seal"
	# 		]

	# 		for checkbox in checkboxes:
	# 			# Check if the checkbox is enabled
	# 			if getattr(self, checkbox):
	# 				create_servicing_for_item(self, checkbox)

	# 		frappe.msgprint("Servicing created successfully")

	# def create_servicing_for_item(self, item_name):
	# 	Serv = frappe.new_doc("Servicing")
	# 	Serv.repair_order = self.name
	# 	Serv.company = self.company
	# 	Serv.customer = self.customer
	# 	Serv.customer_name = self.customer_name
	# 	Serv.warehouse = self.warehouse
	# 	Serv.service_item = item_name  # Set the service item based on checkbox name
	# 	Serv.qty = 1  # You might adjust this based on your requirements
	# 	Serv.insert()
	# 	Serv.save()

 