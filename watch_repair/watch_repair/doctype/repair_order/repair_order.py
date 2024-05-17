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
		

		# if watch.auto_create_servicing:
		# 	frappe.db.sql("""UPDATE `tabRepair Order` SET servicing_status='Completed' WHERE name=%s""", self.name)
		# 	frappe.db.commit()

		# 	for item in self.repair_order_item:
		# 		for checkbox in ["polishing", "pin_and_tube", "loop_with_screw", "push_pin", "clasp", "bra_links",
		# 						"movement", "service", "crown", "crystal", "dial", "hands", "case", "welding",
		# 						"drilling", "glass_decor", "anchor", "b_gasket", "bezel", "bracelet", "strap",
		# 						"battery", "checking_time_day__date", "stopped", "polish", "other", "module",
		# 						"pusher", "case_back", "casing_ring", "case_tube", "case_back_screw", "dial_ring",
		# 						"middle_part_of_case", "bezel_screw", "g_gasket", "cb_gasket", "back_washer", "crown_seal"]:
					
		# 			if item.get(checkbox):  

		# 				Serv = frappe.new_doc("Servicing")
		# 				Serv.repair_order = self.name
		# 				Serv.company = self.company
		# 				Serv.customer = self.customer
		# 				Serv.customer_name = self.customer_name
		# 				Serv.warehouse = self.warehouse
		# 				Serv.posting_date = today()

		# 				Serv.item = item.item
		# 				Serv.service_item_name = item.item_name
		# 				Serv.qty = item.qty
		# 				Serv.serial_no = item.serial_no
		# 				Serv.model_no = item.model_no
		# 				# Serv.complaint_details = item.
		# 				Serv.checkbox = checkbox  

		# 				Serv.insert()
		# 				Serv.save()

		# 	self.reload()
		# 	frappe.msgprint("Servicing created successfully")

		# 	return Serv.name
		
		# return jw.name


		if watch.auto_create_servicing:
			frappe.db.sql("""UPDATE `tabRepair Order` SET servicing_status='Completed' WHERE name=%s""", self.name)
			frappe.db.commit()

			for item in self.repair_order_item:
				for checkbox, complaint_field, remark_field in [
					("polishing", "polishing_complaint_details", "technical_remark__polishing"),
					("pin_and_tube", "pin_and_tube_complaint_details", "technical_remark_pin_and_tube"),
					("loop_with_screw", "loop_with_screw_complaint_details", "technical_remark__loop_with_screw"),
					("push_pin", "push_pin_complaint_details", "technical_remark_push_pin"),
					("clasp", "clasp_complaint_details", "technical_remark_clasp"),
					("bra_links", "bra_links_complaint_details", "technical_remark_bra_links"),
					("movement", "movement_complaint_details", "technical_remark_mc"),
					("service", "service_complaint_details", "technical_remark_sc"),
					("crown", "crown_complaint_details", "technical_remark_ccc"),
					("crystal", "crystal_complaint_details", "technical_remark_sc_ccd"),
					("dial", "dial_complaint_details", "technical_remark_dial"),
					("hands", "hands_complaint_details", "technical_remark_hands"),
					("case", "case_complaint_details", "technical_remark_case"),
					("welding", "welding_complaint_details", "technical_remark_welding"),
					("drilling", "drilling_complaint_details", "technical_remark_drilling"),
					("glass_decor", "glass_decor_complaint_details", "technical_remark_glass_decor"),
					("anchor", "anchor_complaint_details", "technical_remark_anchor"),
					("b_gasket", "b_gasket_complaint_details", "technical_remark_b_gasket"),
					("bezel", "bezel_complaint_details", "technical_remark_bezel"),
					("bracelet", "bracelet_complaint_details", "technical_remark_bracelet"),
					("strap", "strap_complaint_details", "technical_remark_strap"),
					("battery", "battery_complaint_details", "technical_remark_battery"),
					("checking_time_day_date", "checking_time_day_date_complaint_details", "technical_remark_checking_time_day_date"),
					("stopped", "stopped_complaint_details", "technical_remark_stopped"),
					("polish", "polish_complaint_details", "technical_remark_polish"),
					("other", "other_complaint_details", "technical_remark_other"),
					("module", "module_complaint_details", "technical_remark_module"),
					("pusher", "pusher_complaint_details", "technical_remark_pusher"),
					("case_back", "case_back_complaint_details", "technical_remark_case_back"),
					("casing_ring", "casing_ring_complaint_details", "technical_remark_casing_ring"),
					("case_tube", "case_tube_complaint_details", "technical_remark_case_tube"),
					("case_back_screw", "case_back_screw_complaint_details", "technical_remark_case_back_screw"),
					("dial_ring", "dial_ring_complaint_details", "technical_remark_dial_ring"),
					("middle_part_of_case", "middle_part_of_case_complaint_details", "technical_remark_middle_part_of_case"),
					("bezel_screw", "bezel_screw_complaint_details", "technical_remark_bezel_screw"),
					("g_gasket", "g_gasket_complaint_details", "technical_remark_g_gasket"),
					("cb_gasket", "cb_gasket_complaint_details", "technical_remark_cb_gasket"),
					("back_washer", "back_washer_complaint_details", "technical_remark_back_washer"),
					("crown_seal", "crown_seal_complaint_details", "technical_remark_crown_seal"),
					]:
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
						Serv.checkbox = checkbox

						complaint_details = item.get(complaint_field)
						if complaint_details is not None:
							if Serv.complaint_details:
								Serv.complaint_details = "\n"
							Serv.complaint_details = complaint_details

						technical_remark = item.get(remark_field)
						if technical_remark is not None:
							if Serv.technical_remark:
								Serv.technical_remark = "\n"
							Serv.technical_remark = technical_remark

						Serv.insert()
						Serv.save()

			self.reload()
			frappe.msgprint("Servicing created successfully")





	
		


