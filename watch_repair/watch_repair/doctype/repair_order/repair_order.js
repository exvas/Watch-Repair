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



        if (cur_frm.doc.docstatus === 1 && cur_frm.doc.status !== 'Closed' && cur_frm.doc.status == 'Pending') {
            frm.add_custom_button(('Close'), function() {
                frappe.prompt(
                    [
                        {
                            label: 'Close Reason',
                            fieldname: 'close_reason',
                            fieldtype: 'Small Text',
                            reqd: 1
                        }
                    ],
                    function(values){
                        // frappe.msgprint((`${cur_frm.doc.name} - This document was closed`));
                        // frm.set_value('status', 'Closed');
                        // frm.set_value('close_reason', values.close_reason);
                        frm.save_or_update();
                        // frm.refresh();
                        cur_frm.call({
                            doc: cur_frm.doc,
                            method: 'delete_job_ser',
                            args: {
                                close_reason: values.close_reason
                            },
                            callback: function(response) {
                                if(response.message) {
                                    frappe.show_alert({
                                        message: response.message,
                                        indicator: 'green'
                                    });
                                }
                            }
                        });
                    },
                    'Close Repair Order',
                    'Close'
                );
            });
            
        }

		// if (cur_frm.doc.docstatus === 1 && cur_frm.doc.status !== 'Closed') {
		// 	frm.add_custom_button(('Close'), function() {
		// 		frappe.msgprint((`${cur_frm.doc.name} - This document was closed`));
		// 		frm.set_value('status', 'Closed');
        //         cur_frm.call({
        //             doc: cur_frm.doc,
        //             method: 'delete_job_ser',
        //             args: {
        //             },
        //             callback: function(response) {
        //             }
        //         });
                
		// 	});
		// }

		// if (cur_frm.doc.status === 'Closed') {
		// 	frm.add_custom_button(('Open'), function() {
		// 		frappe.msgprint((`${cur_frm.doc.name} - This document was Open`));
		// 		frm.set_value('status', 'Pending');
		// 		frm.save();
		// 	});
		// }

      


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
					  company: frm.doc.company,
                      is_group: 0 
				  }
			  };
		  });
		  frm.set_value('warehouse', ''); 
	  },

//////////////////////////////////////////////////////////////////////////
//////// For Must Select a check box in child table  ////////////////


	//   validate: function(frm) {
    //     let has_checked_item = false;

    //     frm.doc.repair_order_item.forEach(item => {
    //         if (item.polishing || item.pin_and_tube || item.loop_with_screw || item.push_pin || item.clasp || item.bra_links ||
    //             item.movement || item.service || item.crown || item.crystal || item.dial || item.hands || item.case || 
    //             item.welding || item.drilling || item.glass_decor || item.anchor || item.b_gasket || item.bezel || 
    //             item.bracelet || item.strap || item.battery || item.checking_time_day_date || item.stopped || 
    //             item.polish || item.other || item.module || item.pusher || item.case_back || item.casing_ring || 
    //             item.case_tube || item.case_back_screw || item.dial_ring || item.middle_part_of_case || item.bezel_screw || 
    //             item.g_gasket || item.cb_gasket || item.back_washer || item.crown_seal) {
    //                 has_checked_item = true;
    //         }
    //     });

    //     if (!has_checked_item) {
    //         frappe.msgprint(__('Please select at least one Complaint item checkbox in Complaint Details before saving.'));
    //         frappe.validated = false;
    //     }
    // }

    validate: function(frm) {
        let all_items_valid = true;
    
        frm.doc.repair_order_item.forEach(item => {
            let has_checked_item = false;
    
            if (
                item.polishing || item.pin_and_tube || item.loop_with_screw || item.push_pin || item.clasp || item.bra_links ||
                item.movement || item.service || item.crown || item.crystal || item.dial || item.hands || item.case || 
                item.welding || item.drilling || item.glass_decor || item.anchor || item.b_gasket || item.bezel || 
                item.bracelet || item.strap || item.battery || item.checking_time_day_date || item.stopped || 
                item.polish || item.other || item.module || item.pusher || item.case_back || item.casing_ring || 
                item.case_tube || item.case_back_screw || item.dial_ring || item.middle_part_of_case || item.bezel_screw || 
                item.g_gasket || item.cb_gasket || item.back_washer || item.crown_seal
            ) {
                has_checked_item = true;
            }
    
            if (!has_checked_item) {
                all_items_valid = false;
            }
        });
    
        if (!all_items_valid) {
            frappe.msgprint(__('Please select at least one Complaint item checkbox in each row of Complaint Details before saving.'));
            frappe.validated = false;
        }
    }


////////////////////////////////////////////////////////////////////////////////////////////////////







  });
 