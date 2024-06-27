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
		job_work_map = {}

		if self.is_advanced:
			
			pe = frappe.new_doc("Payment Entry")
			pe.custom_repair_order = self.name
			pe.payment_type = "Receive"
			pe.mode_of_payment = self.mode_of_payment
			pe.company = self.company
			pe.party_type = "Customer"
			pe.party = self.customer
			pe.paid_amount = self.amount
			
			pe.received_amount = self.received_amount
			pe.target_exchange_rate = self.target_exchange_rate
			pe.paid_to_account_currency = self.account_currency
			pe.paid_to = self.account_paid_to
			

			pe.insert()
			pe.submit()
			frappe.msgprint(" Payment Entry created successfully ")


		if watch.auto_create_job_work:

			frappe.db.sql("""UPDATE `tabRepair Order` SET job_work_status='Completed' WHERE name=%s""", self.name)
			frappe.db.commit()

			for item in self.repair_order_item:
				

				jw = frappe.new_doc("Job Work")
				jw.repair_order = self.name
				jw.company = self.company
				jw.customer = self.customer
				jw.customer_name = self.customer_name
				jw.expense_account = self.expense_account
				# jw.description1 = self.description
				jw.warehouse = self.warehouse
				jw.status = "Pending"

				jw.service_item = item.item
				jw.service_item_name = item.item_name
				jw.qty = item.qty
				jw.uom = item.uom
				jw.serial_no = item.serial_no
				jw.model_no = item.model_no

			
			
				jw.insert()
				jw.save()

				job_work_map[item.name] = jw.name

			self.reload()
			frappe.msgprint(" Job Work created successfully ")

	


		if watch.auto_create_servicing:
			frappe.db.sql("""UPDATE `tabRepair Order` SET servicing_status='Completed' WHERE name=%s""", self.name)
			frappe.db.commit()

			for item in self.repair_order_item:

				for checkbox, complaint_field, remark_field, skip_checkbox in [
					("polishing", "polishing_complaint_details", "technical_remark__polishing", "skip_servicing_creation_polishing"),

					("pin_and_tube", "pin_and_tube_complaint_details", "technical_remark_pin_and_tube", "skip_servicing_creation_pin_and_tube"),

					("loop_with_screw", "loop_with_screw_complaint_details", "technical_remark__loop_with_screw", "skip_servicing_creation_loop_with_screw"),

					("push_pin", "push_pin_complaint_details", "technical_remark_push_pin", "skip_servicing_creation_push_pin"),

					("clasp", "clasp_complaint_details", "technical_remark_clasp", "skip_servicing_creation_clasp"),

					("bra_links", "bra_links_complaint_details", "technical_remark_bra_links", "skip_servicing_creation_bra_links"),

					("movement", "movement_complaint_details", "technical_remark_mc", "skip_servicing_creation_movement"),

					("service", "service_complaint_details", "technical_remark_sc", "skip_servicing_creation_service"),

					("crown", "crown_complaint_details", "technical_remark_ccc", "skip_servicing_creation_crown"),

					("crystal", "crystal_complaint_details", "technical_remark_sc_ccd", "skip_servicing_creation_crystal" ),

					("dial", "dial_complaint_details", "technical_remark_scdc", "skip_servicing_creation_dial"),

					("hands", "hands_complaint_details", "technical_remark_schc", "skip_servicing_creation_hands"),

					("case", "case_complaint_details", "technical_remark_scccs", "skip_servicing_creation_case"),

					("welding", "welding_complaint_details", "technical_remark_welding", "skip_servicing_creation_welding"),

					("drilling", "drilling_complaint_details", "technical_remark_drilling", "skip_servicing_creation_drilling"),

					("glass_decor", "glass_decor_complaint_details", "technical_remark_glass_decor", "skip_servicing_creation_"),

					("anchor", "anchor_complaint_details", "technical_remark_anchor", "skip_servicing_creation_anchor"),

					("b_gasket", "b_gasket_complaint_details", "technical_remark_b_gasket", "skip_servicing_creation_b_gasket"),

					("bezel", "bezel_complaint_details", "technical_remark_bcc", "skip_servicing_creation_bezel"),

					("bracelet", "bracelet_complaint_details", "technical_remark_bccbc", "skip_servicing_creation_bracelet"),

					("strap", "strap_complaint_details", "technical_remark_bccst", "skip_servicing_creation_strap"),

					("battery", "battery_complaint_details", "technical_remark_bccbcc", "skip_servicing_creation_battery"),

					("checking_time_day_date", "checking_time_day_date_complaint_details", "technical_remark_bccch", "skip_servicing_creation_checking_time_day__date"),

					("stopped", "stopped_complaint_details", "technical_remark_bccsc", "skip_servicing_creation_stopped"),

					("polish", "polish_complaint_details", "technical_remark_bccpc", "skip_servicing_creation_polish"),

					("other", "polish_complaint_details", "technical_remark_bccocd", "skip_servicing_creation_other"),

					("module", "module_complaint_details", "technical_remark_module", "skip_servicing_creation_module"),

					("pusher", "pusher_complaint_details", "technical_remark_pusher", "skip_servicing_creation_pusher"),

					("case_back", "case_back_complaint_details", "technical_remark_case_back", "skip_servicing_creation_case_back"),

					("casing_ring", "casing_ring_complaint_details", "technical_remark_casing_ring", "skip_servicing_creation_casing_ring"),

					("case_tube", "case_tube_complaint_details", "technical_remark_case_tube" , "skip_servicing_creation_case_tube"),
					
					("case_back_screw", "case_back_screw__complaint_details", "technical_remark_case_back_screw", "skip_servicing_creation_case_back_screw"),

					("dial_ring", "dial_ring_complaint_details", "technical_remark_dial_ring", "skip_servicing_creation_dial_ring"),

					("middle_part_of_case", "middle_part_of_case_complaint_details", "technical_remark_middle_part_of_case", "skip_servicing_creation_middle_part_of_case"),

					("bezel_screw", "bezel_screw_complaint_details", "technical_remark_bezel_screw", "skip_servicing_creation_bezel_screw"),

					("g_gasket", "g_gasket_complaint_details", "technical_remark_g_gasket", "skip_servicing_creation_g_gasket"),

					("cb_gasket", "cb_gasket_complaint_details", "technical_remark_cb_gasket", "skip_servicing_creation_cb_gasket"),

					("back_washer", "back_washer_complaint_details", "technical_remark_back_washer", "skip_servicing_creation_back_washer"),

					("crown_seal", "crown_seal_complaint_details", "technical_remark_crown_seal", "skip_servicing_creation_crown_seal"),
					]:
					if item.get(checkbox) and (not item.get(skip_checkbox)):
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
						Serv.job_work = job_work_map.get(item.name)

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
		self.reload()



#------------------  Create Buttotn Action JOB WORK Creation -----------------

	@frappe.whitelist()
	def create_job_work(self):

		for item in self.repair_order_item:
				

				job = frappe.new_doc("Job Work")
				job.repair_order = self.name
				job.company = self.company
				job.customer = self.customer
				job.customer_name = self.customer_name
				job.warehouse = self.warehouse

				job.service_item = item.item
				job.service_item_name = item.item_name
				job.qty = item.qty
				job.uom = item.uom
				job.serial_no = item.serial_no
				job.model_no = item.model_no

			
			
				job.insert()
				job.save()

		self.reload()
		frappe.msgprint(" Job Work created successfully ")

		frappe.db.sql("""UPDATE `tabRepair Order` SET job_work_status='Completed' WHERE name=%s""", self.name)
		frappe.db.commit()


#------------------------------- Servicing Creation ------------------------------------
	
	@frappe.whitelist()
	def create_servicing(self):
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

					("dial", "dial_complaint_details", "technical_remark_scdc"),

					("hands", "hands_complaint_details", "technical_remark_schc"),

					("case", "case_complaint_details", "technical_remark_scccs"),

					("welding", "welding_complaint_details", "technical_remark_welding"),

					("drilling", "drilling_complaint_details", "technical_remark_drilling"),

					("glass_decor", "glass_decor_complaint_details", "technical_remark_glass_decor"),

					("anchor", "anchor_complaint_details", "technical_remark_b_gasket"),

					("b_gasket", "b_gasket_complaint_details", "technical_remark_b_gasket"),

					("bezel", "bezel_complaint_details", "technical_remark_bcc"),

					("bracelet", "bracelet_complaint_details", "technical_remark_bccbc"),

					("strap", "strap_complaint_details", "technical_remark_bccst"),

					("battery", "battery_complaint_details", "technical_remark_bccbcc"),

					("checking_time_day_date", "checking_time_day_date_complaint_details", "technical_remark_bccch"),

					("stopped", "stopped_complaint_details", "technical_remark_bccsc"),

					("polish", "polish_complaint_details", "technical_remark_bccpc"),

					("other", "polish_complaint_details", "technical_remark_bccocd"),

					("module", "module_complaint_details", "technical_remark_module"),

					("pusher", "pusher_complaint_details", "technical_remark_pusher"),

					("case_back", "case_back_complaint_details", "technical_remark_case_back"),

					("casing_ring", "casing_ring_complaint_details", "technical_remark_casing_ring"),

					("case_tube", "case_tube_complaint_details", "technical_remark_case_tube"),
					
					("case_back_screw", "case_back_screw__complaint_details", "technical_remark_case_back_screw"),

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
				frappe.db.sql("""UPDATE `tabRepair Order` SET servicing_status='Completed' WHERE name=%s""", self.name)
				frappe.db.commit()
			
	
	# def on_cancel(self):


	# 	frappe.db.sql("""update `tabRepair Order` set status='Cancelled' where name=%s""", self.name)
		
	# 	frappe.db.commit()

	# 	psr_name = frappe.db.get_value("Job Work", {"repair_order": self.name}, "name")

	# 	if psr_name:
	# 		psr_doc = frappe.get_doc("Job Work", psr_name)

	# 		if psr_doc.docstatus == 0:
	# 			frappe.delete_doc("Job Work", psr_name)
	# 		elif psr_doc.docstatus == 1:
	# 			psr_doc.cancel()
	# 		else:
	# 			pass


	# 	service = frappe.db.get_value("Servicing", {"repair_order": self.name}, "name")

	# 	if service:
	# 		psr_doc = frappe.get_doc("Servicing", service)

	# 		if psr_doc.docstatus == 0:
	# 			frappe.delete_doc("Servicing", service)
	# 		elif psr_doc.docstatus == 1:
	# 			psr_doc.cancel()
	# 		else:
	# 			pass

	
	# 	self.reload()

	@frappe.whitelist()
	def delete_job_ser(self, close_reason):

		

		job_work = frappe.db.get_value("Job Work", {"repair_order": self.name}, "name")
		service = frappe.db.get_value("Servicing", {"repair_order": self.name}, "name")


		if service:
			serv = frappe.get_doc("Servicing",service)

			if serv.docstatus == 0:
				frappe.delete_doc("Servicing", service)

		if job_work:
			job = frappe.get_doc("Job Work", job_work)

			if job.docstatus == 0:
				frappe.delete_doc("Job Work",job_work)

		self.submit()

		# frappe.msgprint("Related Job Work and Servicing documents deleted successfully.")
		frappe.db.sql("""UPDATE `tabRepair Order` SET status='Closed' WHERE name=%s""", self.name)
		frappe.db.sql("""UPDATE `tabRepair Order` SET close_reason = %s WHERE name=%s""",(close_reason, self.name))
		frappe.db.commit()

		return "Related Job Work and Servicing documents deleted successfully."
		
		
		

	
		


 