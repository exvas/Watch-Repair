// Copyright (c) 2024, sammish and contributors
// For license information, please see license.txt

frappe.ui.form.on('Repair Order', { 
	refresh: function(frm) {
	  
	  
		frm.set_query('warehouse', function() {
			return {
				filters: {
					company: frm.doc.company
				}
			};
		});

		if (cur_frm.doc.docstatus === 1) {
			frm.add_custom_button(('Close'), function() {
				frappe.msgprint((`${cur_frm.doc.name} - This document was closed`));
				frm.set_value('status', 'Closed');
				frm.save();
			});
		}

		if (cur_frm.doc.status === 'Closed') {
			frm.add_custom_button(('Open'), function() {
				frappe.msgprint((`${cur_frm.doc.name} - This document was Open`));
				frm.set_value('status', 'Pending');
				frm.save();
			});
		}


		if (cur_frm.doc.job_work_status === 'Not Completed') {
			frm.add_custom_button(__('Job Work '), function() {
                console.log("testing")
                cur_frm.call({
                    doc: cur_frm.doc,
                    method: 'create_job_work',
                    args: {
                        // order_and_dispatch: frm.doc.name
                    },
                    callback: function(response) {
                        // frappe.set_route("Form", "SFG BOM", response.message);                  
                    }
                });
            
            }, __("Create"));
		}
		

		if (cur_frm.doc.servicing_status === 'Not Completed') {
			frm.add_custom_button(__('Servicing '), function() {
                console.log("testing service")
                cur_frm.call({
                    doc: cur_frm.doc,
                    method: 'create_servicing',
                    args: {
                        // order_and_dispatch: frm.doc.name
                    },
                    callback: function(response) {
                        // frappe.set_route("Form", "SFG BOM", response.message);                  
                    }
                });
            
            }, __("Create"));
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
 