// Copyright (c) 2024, sammish and contributors
// For license information, please see license.txt

frappe.ui.form.on('Repair Order', {
	refresh: function(frm) {
	  
	  console.log("sarath")
	  
		frm.set_query('warehouse', function() {
			return {
				filters: {
					company: frm.doc.company
				}
			};
		});

		if (cur_frm.doc.docstatus === 1) {
			frm.add_custom_button(('Close'), function() {
				frappe.msgprint(('Close button clicked'));
				frm.set_value('status', 'Closed');
				frm.save();
			});
		}

		if (cur_frm.doc.status === 'Closed') {
			frm.add_custom_button(('Open'), function() {
				frappe.msgprint(('Open button clicked'));
				frm.set_value('status', 'Pending');
				frm.save();
			});
		}


		if (cur_frm.doc.job_work_status === 'Not Completed') {
			frm.add_custom_button(('Job Work'), function() {
				frappe.msgprint(('Repair Order clicked'));
			}, 'Create');
		}
		

		if (cur_frm.doc.servicing_status === 'Not Completed') {
			frm.add_custom_button(('Service'), function() {
				frappe.msgprint(('Service clicked'));
			}, 'Create');
		}
		
	  
  
  
  
  
	  },
	  company: function(frm) {
		  frm.set_query('warehouse', function() {
			  return {
				  filters: {
					  company: frm.doc.company
				  }
			  };
		  });
		  frm.set_value('warehouse', ''); 
	  }
  });
 