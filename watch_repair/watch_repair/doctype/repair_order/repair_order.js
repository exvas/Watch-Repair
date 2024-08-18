// Copyright (c) 2024, sammish and contributors
// For license information, please see license.txt
  
frappe.ui.form.on('Repair Order', { 

    abc: function(frm) {
        // Only call the method if the checkbox is checked
        if (frm.doc.abc) {
            frm.call({
                method:"table_update",
                doc: frm.doc,
                args: {
                    docname: frm.doc.name,
                    
                },
                callback: function(r) {
                    if (r.message) {
                        // frappe.msgprint(r.message);
                    }
                }
            });
        }
    },
	refresh: function(frm) {
       
        cur_frm.set_query("item", "repair_order_item", (frm, cdt, cdn) => {
			let d = locals[cdt][cdn];
            return {
                "filters": {
					"custom_is_customer_item":1,
				}
			}
        });
	   
	    
		frm.set_query('warehouse', function() {
			return {
				filters: {
					company: frm.doc.company,
                    is_group: 0
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
		
	  
        let show_close_button = false;

        // Iterate through each item in the repair_order_item child table
        $.each(frm.doc.repair_order_item || [], function(i, item) {
            if (item.complaint_completion_status === 'Return') {
                show_close_button = true;
                return false;  // Exit the loop early if condition is met
            }
        });

        // If any item has complaint_completion_status set to 'Return', display the 'Close' button
        if (show_close_button) {
            frm.add_custom_button(__('Return'), function() {
                // Set the status of the Repair Order to 'Return'
                frm.set_value('status', 'Return');
                
                // Save the form
                frm.save_or_update();
            });
        }

        if (frm.doc.customer) {
            frappe.db.get_value('Payment Entry', { party: frm.doc.customer }, 'paid_amount', (r) => {
                if (r && r.paid_amount) {
                    frm.set_value('paid_amount', r.paid_amount);
                } else {
                    frm.set_value('paid_amount', '');
                }
            });
        } else {
            frm.set_value('paid_amount', '');
        }



        calculate_total_estimated_cost(frm);

  
  
  
	  },
      repair_order_item_add: function(frm) {
        calculate_total_estimated_cost(frm);
    },
    repair_order_item_remove: function(frm) {
        calculate_total_estimated_cost(frm);
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
    },


////////////////////////////////////////////////////////////////////////////////////////////////////


    mode_of_payment: function(frm) {
        var selectedModeOfPayment = frm.doc.mode_of_payment; 

        frappe.call({
            method: 'frappe.client.get',
            args: {
                doctype: 'Mode of Payment',  
                name: selectedModeOfPayment
            },
            callback: function(response) {
                if (response.message) {
                    var modeOfPaymentDoc = response.message;

                    var accountsTable = modeOfPaymentDoc.accounts || [];

                    var defaultAccount = accountsTable.length > 0 ? accountsTable[0].default_account : '';

                    frm.set_value('account_paid_to', defaultAccount);
                } else {
                    frm.set_value('account_paid_to', '');  
                }
            }
        });
    },


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// kfc: function(frm) {
//     if (frm.doc.kfc) {
//         let details = `<table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
//                         <thead>
//                             <tr>
//                                 <th>Item</th>
//                                 <th>Quantity</th>
//                                 <th>Complaint</th>
//                                 <th>Complaint Details</th>
//                                 <th>Technical Remark</th>
//                                 <th>Estimated Amount</th>
//                             </tr>
//                         </thead>
//                         <tbody>`;

//         frm.doc.repair_order_item.forEach(item => {
//             const addComplaintRow = (complaint, details, remark, amount) => {
//                 return `<tr>
//                             <td>${item.item || ''}</td>
//                             <td>${item.qty || ''}</td>
//                             <td>${complaint || ''}</td>
//                             <td>${details || ''}</td>
//                             <td>${remark || ''}</td>
//                             <td>${amount || ''}</td>
//                         </tr>`;
//             };

//             // Add rows for each complaint
//             if (item.polishing) {
//                 details += addComplaintRow('Polishing', item.polishing_complaint_details, item.technical_remark__polishing, item.estimated_amount1);
//             }
//             if (item.pin_and_tube) {
//                 details += addComplaintRow('Pin and Tube', item.pin_and_tube_complaint_details, item.technical_remark_pin_and_tube, item.estimated_amount111);
//             }
//             if (item.loop_with_screw) {
//                 details += addComplaintRow('Loop with Screw', item.loop_with_screw_complaint_details, item.technical_remark__loop_with_screw, item.estimated_amount121);
//             }
//             if (item.push_pin) {
//                 details += addComplaintRow('Push Pin', item.push_pin_complaint_details, item.technical_remark_push_pin, item.estimated_amount122);
//             }
//             if (item.clasp) {
//                 details += addComplaintRow('Clasp', item.clasp_complaint_details, item.technical_remark_clasp, item.estimated_amount123);
//             }
//             if (item.bra_links) {
//                 details += addComplaintRow('Bra Links', item.bra_links_complaint_details, item.technical_remark_bra_links, item.estimated_amount124);
//             }
//             if (item.movement) {
//                 details += addComplaintRow('Movement', item.movement_complaint_details, item.technical_remark_mc, item.estimated_amount125);
//             }
//             if (item.service) {
//                 details += addComplaintRow('Service', item.service_complaint_details, item.technical_remark_sc, item.estimated_amount1239);
//             }
//             if (item.crown) {
//                 details += addComplaintRow('Crown', item.crown_complaint_details, item.technical_remark_ccc, item.estimated_amount1qq);
//             }
//             if (item.crystal) {
//                 details += addComplaintRow('Crystal', item.crystal_complaint_details, item.technical_remark_sc_ccd, item.estimated_amount100);
//             }
//             if (item.dial) {
//                 details += addComplaintRow('Dial', item.dial_complaint_details, item.technical_remark_scdc, item.estimated_amount101);
//             }
//             if (item.hands) {
//                 details += addComplaintRow('Hands', item.hands_complaint_details, item.technical_remark_schc, item.estimated_amount102);
//             }
//             if (item.case) {
//                 details += addComplaintRow('Case', item.case_complaint_details, item.technical_remark_scccs, item.estimated_amount103);
//             }
//             if (item.welding) {
//                 details += addComplaintRow('Welding', item.welding_complaint_details, item.technical_remark_welding, item.estimated_amount104);
//             }
//             if (item.drilling) {
//                 details += addComplaintRow('Drilling', item.drilling_complaint_details, item.technical_remark_drilling, item.estimated_amount105);
//             }
//             if (item.glass_decor) {
//                 details += addComplaintRow('Glass Decor', item.glass_decor_complaint_details, item.technical_remark_glass_decor, item.estimated_amount106);
//             }
//             if (item.anchor) {
//                 details += addComplaintRow('Anchor', item.anchor_complaint_details, item.technical_remark_anchor, item.estimated_amount107);
//             }
//             if (item.b_gasket) {
//                 details += addComplaintRow('B Gasket', item.b_gasket_complaint_details, item.technical_remark_b_gasket, item.estimated_amount137);
//             }
//             if (item.bezel) {
//                 details += addComplaintRow('Bezel', item.bezel_complaint_details, item.technical_remark_bcc, item.estimated_amount108);
//             }
//             if (item.bracelet) {
//                 details += addComplaintRow('Bracelet', item.bracelet_complaint_details, item.technical_remark_bccbc, item.estimated_amount109);
//             }
//             if (item.strap) {
//                 details += addComplaintRow('Strap', item.strap_complaint_details, item.technical_remark_bccst, item.estimated_amount110);
//             }
//             if (item.battery) {
//                 details += addComplaintRow('Battery', item.battery_complaint_details, item.technical_remark_bccbcc, item.estimated_amount112);
//             }
//             if (item.checking_time_day__date) {
//                 details += addComplaintRow('Checking Time Day/Date', item.checking_time_day_date_complaint_details, item.technical_remark_bccch, item.estimated_amount113);
//             }
//             if (item.stopped) {
//                 details += addComplaintRow('Stopped', item.stopped_complaint_details, item.technical_remark_bccsc, item.estimated_amount115);
//             }
//             if (item.polish) {
//                 details += addComplaintRow('Polish', item.polish_complaint_details, item.technical_remark_bccpc, item.estimated_amount116);
//             }
//             if (item.other) {
//                 details += addComplaintRow('Other', item.other_complaint_details, item.technical_remark_bccocd, item.estimated_amount117);
//             }
//             if (item.module) {
//                 details += addComplaintRow('Module', item.module_complaint_details, item.technical_remark_module, item.estimated_amount118);
//             }
//             if (item.pusher) {
//                 details += addComplaintRow('Pusher', item.pusher_complaint_details, item.technical_remark_pusher, item.estimated_amount119);
//             }
//             if (item.case_back) {
//                 details += addComplaintRow('Case Back', item.case_back_complaint_details, item.technical_remark_case_back, item.estimated_amount1255);
//             }
//             if (item.casing_ring) {
//                 details += addComplaintRow('Casing Ring', item.casing_ring_complaint_details, item.technical_remark_casing_ring, item.estimated_amount1241);
//             }
//             if (item.case_tube) {
//                 details += addComplaintRow('Case Tube', item.case_tube_complaint_details, item.technical_remark_case_tube, item.estimated_amount127);
//             }
//             if (item.case_back_screw) {
//                 details += addComplaintRow('Case Back Screw', item.case_back_screw__complaint_details, item.technical_remark_case_back_screw, item.estimated_amount128);
//             }
//             if (item.dial_ring) {
//                 details += addComplaintRow('Dial Ring', item.dial_ring_complaint_details, item.technical_remark_dial_ring, item.estimated_amount129);
//             }
//             if (item.middle_part_of_case) {
//                 details += addComplaintRow('Middle Part of Case', item.middle_part_of_case_complaint_details, item.technical_remark_middle_part_of_case, item.estimated_amount130);
//             }
//             if (item.bezel_screw) {
//                 details += addComplaintRow('Bezel Screw', item.bezel_screw_complaint_details, item.technical_remark_bezel_screw, item.estimated_amount131);
//             }
//             if (item.g_gasket) {
//                 details += addComplaintRow('G Gasket', item.g_gasket_complaint_details, item.technical_remark_g_gasket, item.estimated_amount133);
//             }
//             if (item.cb_gasket) {
//                 details += addComplaintRow('CB Gasket', item.cb_gasket_complaint_details, item.technical_remark_cb_gasket, item.estimated_amount134);
//             }
//             if (item.back_washer) {
//                 details += addComplaintRow('Back Washer', item.back_washer_complaint_details, item.technical_remark_back_washer, item.estimated_amount135);
//             }
//             if (item.crown_seal) {
//                 details += addComplaintRow('Crown Seal', item.crown_seal_complaint_details, item.technical_remark_crown_seal, item.estimated_amount136);
//             }
//         });

//         details += `</tbody></table>`;

//         frm.set_value('details', details);
//     } else {
//         frm.set_value('details', '');
//     }
// }


kfc: function(frm) {
    if (frm.doc.kfc) {
        let details = `<table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Item Name</th>
                                <th>Qty</th>
                                <th>Complaint</th>
                                <th>Complaint Details</th>
                                <th>Technical Remarks</th>
                                <th>Estimated Amount</th>
                            </tr>
                        </thead>
                        <tbody>`;

        frm.doc.repair_order_item.forEach(item => {
            let firstRow = true;

            const addComplaintRow = (complaint, details, remark, amount) => {
                let itemCell = firstRow ? `<td>${item.item || ''}</td><td>${item.item_name || ''}</td><td>${item.qty || ''}</td>` : `<td></td><td></td><td></td>`;
                firstRow = false;

                return `<tr>
                            ${itemCell}
                            <td>${complaint || ''}</td>
                            <td>${details || ''}</td>
                            <td>${remark || ''}</td>
                            <td>${amount || ''}</td>
                        </tr>`;
            };

            // Add rows for each complaint
            if (item.polishing) {
                details += addComplaintRow('Polishing', item.polishing_complaint_details, item.technical_remark__polishing, item.estimated_amount1);
            }
            if (item.pin_and_tube) {
                details += addComplaintRow('Pin and Tube', item.pin_and_tube_complaint_details, item.technical_remark_pin_and_tube, item.estimated_amount111);
            }
            if (item.loop_with_screw) {
                details += addComplaintRow('Loop with Screw', item.loop_with_screw_complaint_details, item.technical_remark__loop_with_screw, item.estimated_amount121);
            }
            if (item.push_pin) {
                details += addComplaintRow('Push Pin', item.push_pin_complaint_details, item.technical_remark_push_pin, item.estimated_amount122);
            }
            if (item.clasp) {
                details += addComplaintRow('Clasp', item.clasp_complaint_details, item.technical_remark_clasp, item.estimated_amount123);
            }
            if (item.bra_links) {
                details += addComplaintRow('Bra Links', item.bra_links_complaint_details, item.technical_remark_bra_links, item.estimated_amount124);
            }
            if (item.movement) {
                details += addComplaintRow('Movement', item.movement_complaint_details, item.technical_remark_mc, item.estimated_amount125);
            }
            if (item.service) {
                details += addComplaintRow('Service', item.service_complaint_details, item.technical_remark_sc, item.estimated_amount1239);
            }
            if (item.crown) {
                details += addComplaintRow('Crown', item.crown_complaint_details, item.technical_remark_ccc, item.estimated_amount1qq);
            }
            if (item.crystal) {
                details += addComplaintRow('Crystal', item.crystal_complaint_details, item.technical_remark_sc_ccd, item.estimated_amount100);
            }
            if (item.dial) {
                details += addComplaintRow('Dial', item.dial_complaint_details, item.technical_remark_scdc, item.estimated_amount101);
            }
            if (item.hands) {
                details += addComplaintRow('Hands', item.hands_complaint_details, item.technical_remark_schc, item.estimated_amount102);
            }
            if (item.case) {
                details += addComplaintRow('Case', item.case_complaint_details, item.technical_remark_scccs, item.estimated_amount103);
            }
            if (item.welding) {
                details += addComplaintRow('Welding', item.welding_complaint_details, item.technical_remark_welding, item.estimated_amount104);
            }
            if (item.drilling) {
                details += addComplaintRow('Drilling', item.drilling_complaint_details, item.technical_remark_drilling, item.estimated_amount105);
            }
            if (item.glass_decor) {
                details += addComplaintRow('Glass Decor', item.glass_decor_complaint_details, item.technical_remark_glass_decor, item.estimated_amount106);
            }
            if (item.anchor) {
                details += addComplaintRow('Anchor', item.anchor_complaint_details, item.technical_remark_anchor, item.estimated_amount107);
            }
            if (item.b_gasket) {
                details += addComplaintRow('B Gasket', item.b_gasket_complaint_details, item.technical_remark_b_gasket, item.estimated_amount137);
            }
            if (item.bezel) {
                details += addComplaintRow('Bezel', item.bezel_complaint_details, item.technical_remark_bcc, item.estimated_amount108);
            }
            if (item.bracelet) {
                details += addComplaintRow('Bracelet', item.bracelet_complaint_details, item.technical_remark_bccbc, item.estimated_amount109);
            }
            if (item.strap) {
                details += addComplaintRow('Strap', item.strap_complaint_details, item.technical_remark_bccst, item.estimated_amount110);
            }
            if (item.battery) {
                details += addComplaintRow('Battery', item.battery_complaint_details, item.technical_remark_bccbcc, item.estimated_amount112);
            }
            if (item.checking_time_day__date) {
                details += addComplaintRow('Checking Time Day/Date', item.checking_time_day_date_complaint_details, item.technical_remark_bccch, item.estimated_amount113);
            }
            if (item.stopped) {
                details += addComplaintRow('Stopped', item.stopped_complaint_details, item.technical_remark_bccsc, item.estimated_amount115);
            }
            if (item.polish) {
                details += addComplaintRow('Polish', item.polish_complaint_details, item.technical_remark_bccpc, item.estimated_amount116);
            }
            if (item.other) {
                details += addComplaintRow('Other', item.other_complaint_details, item.technical_remark_bccocd, item.estimated_amount117);
            }
            if (item.module) {
                details += addComplaintRow('Module', item.module_complaint_details, item.technical_remark_module, item.estimated_amount118);
            }
            if (item.pusher) {
                details += addComplaintRow('Pusher', item.pusher_complaint_details, item.technical_remark_pusher, item.estimated_amount119);
            }
            if (item.case_back) {
                details += addComplaintRow('Case Back', item.case_back_complaint_details, item.technical_remark_case_back, item.estimated_amount1255);
            }
            if (item.casing_ring) {
                details += addComplaintRow('Casing Ring', item.casing_ring_complaint_details, item.technical_remark_casing_ring, item.estimated_amount1241);
            }
            if (item.case_tube) {
                details += addComplaintRow('Case Tube', item.case_tube_complaint_details, item.technical_remark_case_tube, item.estimated_amount127);
            }
            if (item.case_back_screw) {
                details += addComplaintRow('Case Back Screw', item.case_back_screw__complaint_details, item.technical_remark_case_back_screw, item.estimated_amount128);
            }
            if (item.dial_ring) {
                details += addComplaintRow('Dial Ring', item.dial_ring_complaint_details, item.technical_remark_dial_ring, item.estimated_amount129);
            }
            if (item.middle_part_of_case) {
                details += addComplaintRow('Middle Part of Case', item.middle_part_of_case_complaint_details, item.technical_remark_middle_part_of_case, item.estimated_amount130);
            }
            if (item.bezel_screw) {
                details += addComplaintRow('Bezel Screw', item.bezel_screw_complaint_details, item.technical_remark_bezel_screw, item.estimated_amount131);
            }
            if (item.g_gasket) {
                details += addComplaintRow('G Gasket', item.g_gasket_complaint_details, item.technical_remark_g_gasket, item.estimated_amount133);
            }
            if (item.cb_gasket) {
                details += addComplaintRow('CB Gasket', item.cb_gasket_complaint_details, item.technical_remark_cb_gasket, item.estimated_amount134);
            }
            if (item.back_washer) {
                details += addComplaintRow('Back Washer', item.back_washer_complaint_details, item.technical_remark_back_washer, item.estimated_amount135);
            }
            if (item.crown_seal) {
                details += addComplaintRow('Crown Seal', item.crown_seal_complaint_details, item.technical_remark_crown_seal, item.estimated_amount136);
            }
        });

        details += `</tbody></table>`;

        frm.set_value('details', details);
    } else {
        frm.set_value('details', '');
    }
}







// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // kfc: function(frm) {
    //     if (frm.doc.kfc) {
    //     let details = "";
    //     frm.doc.repair_order_item.forEach(item => {
    //         details += `<strong>Item:</strong> ${item.item || ''}<br>
    //                     <strong>Item Name:</strong> ${item.item_name || ''}<br>
    //                     <strong>Quantity:</strong> ${item.qty || ''}<br><br>`;

    //         // Check for each complaint and add its details if enabled
    //         if (item.polishing) {
    //             details += `<strong>Complaint:</strong> Polishing<br>
    //                         <strong>Complaint Details:</strong> ${item.polishing_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark__polishing || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount1 || ''}<br><br>`;
    //         }
    //         if (item.pin_and_tube) {
    //             details += `<strong>Complaint:</strong> Pin and Tube<br>
    //                         <strong>Complaint Details:</strong> ${item.pin_and_tube_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_pin_and_tube || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount111 || ''}<br><br>`;
    //         }
    //         if (item.loop_with_screw) {
    //             details += `<strong>Complaint:</strong> Loop with Screw<br>
    //                         <strong>Complaint Details:</strong> ${item.loop_with_screw_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_loop_with_screw || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount121 || ''}<br><br>`;
    //         }
    //         if (item.push_pin) {
    //             details += `<strong>Complaint:</strong> Push Pin<br>
    //                         <strong>Complaint Details:</strong> ${item.push_pin_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_push_pin || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount122 || ''}<br><br>`;
    //         }
    //         if (item.clasp) {
    //             details += `<strong>Complaint:</strong> Clasp<br>
    //                         <strong>Complaint Details:</strong> ${item.clasp_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_clasp || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount123 || ''}<br><br>`;
    //         }
    //         if (item.bra_links) {
    //             details += `<strong>Complaint:</strong> Bra Links<br>
    //                         <strong>Complaint Details:</strong> ${item.bra_links_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_bra_links || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount124 || ''}<br><br>`;
    //         }
    //         if (item.movement) {
    //             details += `<strong>Complaint:</strong> Movement<br>
    //                         <strong>Complaint Details:</strong> ${item.movement_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_mc || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount125 || ''}<br><br>`;
    //         }
    //         if (item.service) {
    //             details += `<strong>Complaint:</strong> Service<br>
    //                         <strong>Complaint Details:</strong> ${item.service_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_sc || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount1239 || ''}<br><br>`;
    //         }
    //         if (item.crown) {
    //             details += `<strong>Complaint:</strong> Crown<br>
    //                         <strong>Complaint Details:</strong> ${item.crown_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_ccc || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount1qq || ''}<br><br>`;
    //         }
    //         if (item.crystal) {
    //             details += `<strong>Complaint:</strong> Crystal<br>
    //                         <strong>Complaint Details:</strong> ${item.crystal_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_sc_ccd || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount100 || ''}<br><br>`;
    //         }
    //         if (item.dial) {
    //             details += `<strong>Complaint:</strong> Dial<br>
    //                         <strong>Complaint Details:</strong> ${item.dial_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_scdc || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount101 || ''}<br><br>`;
    //         }
    //         if (item.hands) {
    //             details += `<strong>Complaint:</strong> Hands<br>
    //                         <strong>Complaint Details:</strong> ${item.hands_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_schc || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount102 || ''}<br><br>`;
    //         }
    //         if (item.case) {
    //             details += `<strong>Complaint:</strong> Case<br>
    //                         <strong>Complaint Details:</strong> ${item.case_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_scccs || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount103 || ''}<br><br>`;
    //         }
    //         if (item.welding) {
    //             details += `<strong>Complaint:</strong> Welding<br>
    //                         <strong>Complaint Details:</strong> ${item.welding_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_welding || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount104 || ''}<br><br>`;
    //         }
    //         if (item.drilling) {
    //             details += `<strong>Complaint:</strong> Drilling<br>
    //                         <strong>Complaint Details:</strong> ${item.drilling_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_drilling || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount105 || ''}<br><br>`;
    //         }
    //         if (item.glass_decor) {
    //             details += `<strong>Complaint:</strong> Glass Decor<br>
    //                         <strong>Complaint Details:</strong> ${item.glass_decor_complaint_detailsglass_decor || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_glass_decor || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount106 || ''}<br><br>`;
    //         }
    //         if (item.anchor) {
    //             details += `<strong>Complaint:</strong> Anchor<br>
    //                         <strong>Complaint Details:</strong> ${item.anchor_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_anchor || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount107 || ''}<br><br>`;
    //         }
    //         if (item.b_gasket) {
    //             details += `<strong>Complaint:</strong> B Gasket<br>
    //                         <strong>Complaint Details:</strong> ${item.b_gasket_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_b_gasket || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount137 || ''}<br><br>`;
    //         }
    //         if (item.bezel) {
    //             details += `<strong>Complaint:</strong> Bezel<br>
    //                         <strong>Complaint Details:</strong> ${item.bezel_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_bcc || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount108 || ''}<br><br>`;
    //         }
    //         if (item.bracelet) {
    //             details += `<strong>Complaint:</strong> Bracelet<br>
    //                         <strong>Complaint Details:</strong> ${item.bracelet_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_bccbc || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount109 || ''}<br><br>`;
    //         }
    //         if (item.strap) {
    //             details += `<strong>Complaint:</strong> Strap<br>
    //                         <strong>Complaint Details:</strong> ${item.strap_complaint_details || ''}<br>
    //                         <strong>Technical Remark:</strong> ${item.technical_remark_bccst || ''}<br>
    //                         <strong>Estimated Amount:</strong> ${item.estimated_amount110 || ''}<br><br>`;
    //         }
    //             if (item.battery) {
    //                 details += `<strong>Complaint:</strong> Battery<br>
    //                             <strong>Complaint Details:</strong> ${item.battery_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_bccbcc || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount112 || ''}<br><br>`;
    //             }
    //             if (item.checking_time_day__date) {
    //                 details += `<strong>Complaint:</strong> Checking Time Day/Date<br>
    //                             <strong>Complaint Details:</strong> ${item.checking_time_day_date_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_bccch || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount113 || ''}<br><br>`;
    //             }
    //             if (item.stopped) {
    //                 details += `<strong>Complaint:</strong> Stopped<br>
    //                             <strong>Complaint Details:</strong> ${item.stopped_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_bccsc || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount115 || ''}<br><br>`;
    //             }
    //             if (item.polish) {
    //                 details += `<strong>Complaint:</strong> Polish<br>
    //                             <strong>Complaint Details:</strong> ${item.polish_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_bccpc || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount116 || ''}<br><br>`;
    //             }
    //             if (item.other) {
    //                 details += `<strong>Complaint:</strong> Other<br>
    //                             <strong>Complaint Details:</strong> ${item.other_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_bccocd || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount117 || ''}<br><br>`;
    //             }
    //             if (item.module) {
    //                 details += `<strong>Complaint:</strong> Module<br>
    //                             <strong>Complaint Details:</strong> ${item.module_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_module || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount118 || ''}<br><br>`;
    //             }
    //             if (item.pusher) {
    //                 details += `<strong>Complaint:</strong> Pusher<br>
    //                             <strong>Complaint Details:</strong> ${item.pusher_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_pusher || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount119 || ''}<br><br>`;
    //             }
    //             if (item.case_back) {
    //                 details += `<strong>Complaint:</strong> Case Back<br>
    //                             <strong>Complaint Details:</strong> ${item.case_back_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_case_back || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount1255 || ''}<br><br>`;
    //             }
    //             if (item.casing_ring) {
    //                 details += `<strong>Complaint:</strong> Casing Ring<br>
    //                             <strong>Complaint Details:</strong> ${item.casing_ring_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_casing_ring || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount1241 || ''}<br><br>`;
    //             }
    //             if (item.case_tube) {
    //                 details += `<strong>Complaint:</strong> Case Tube<br>
    //                             <strong>Complaint Details:</strong> ${item.case_tube_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_case_tube || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount127 || ''}<br><br>`;
    //             }
    //             if (item.case_back_screw) {
    //                 details += `<strong>Complaint:</strong> Case Back Screw<br>
    //                             <strong>Complaint Details:</strong> ${item.case_back_screw__complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_case_back_screw || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount128 || ''}<br><br>`;
    //             }
    //             if (item.dial_ring) {
    //                 details += `<strong>Complaint:</strong> Dial Ring<br>
    //                             <strong>Complaint Details:</strong> ${item.dial_ring_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_dial_ring || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount129 || ''}<br><br>`;
    //             }
    //             if (item.middle_part_of_case) {
    //                 details += `<strong>Complaint:</strong> Middle Part of Case<br>
    //                             <strong>Complaint Details:</strong> ${item.middle_part_of_case_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_middle_part_of_case || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount130 || ''}<br><br>`;
    //             }
    //             if (item.bezel_screw) {
    //                 details += `<strong>Complaint:</strong> Bezel Screw<br>
    //                             <strong>Complaint Details:</strong> ${item.bezel_screw_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_bezel_screw || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount131 || ''}<br><br>`;
    //             }
    //             if (item.g_gasket) {
    //                 details += `<strong>Complaint:</strong> G Gasket<br>
    //                             <strong>Complaint Details:</strong> ${item.g_gasket_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_g_gasket || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount133 || ''}<br><br>`;
    //             }
    //             if (item.cb_gasket) {
    //                 details += `<strong>Complaint:</strong> CB Gasket<br>
    //                             <strong>Complaint Details:</strong> ${item.cb_gasket_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_cb_gasket || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount134 || ''}<br><br>`;
    //             }
    //             if (item.back_washer) {
    //                 details += `<strong>Complaint:</strong> Back Washer<br>
    //                             <strong>Complaint Details:</strong> ${item.back_washer_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_back_washer || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount135 || ''}<br><br>`;
    //             }
    //             if (item.crown_seal) {
    //                 details += `<strong>Complaint:</strong> Crown Seal<br>
    //                             <strong>Complaint Details:</strong> ${item.crown_seal_complaint_details || ''}<br>
    //                             <strong>Technical Remark:</strong> ${item.technical_remark_crown_seal || ''}<br>
    //                             <strong>Estimated Amount:</strong> ${item.estimated_amount136 || ''}<br><br>`;
    //             }
               

    //             details += "<hr>";
    //         });
    //         frm.set_value('details', details);
    //     } else {
    //         frm.set_value('details', '');
    //     }
    // }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  });
  

  function calculate_total_estimated_cost(frm) {
    let total = 0;

    frm.doc.repair_order_item.forEach(item => {
        // Sum all estimated amounts if they exist
        if (item.estimated_amount1) total += item.estimated_amount1;
        if (item.estimated_amount111) total += item.estimated_amount111;
        if (item.estimated_amount121) total += item.estimated_amount121;
        if (item.estimated_amount122) total += item.estimated_amount122;
        if (item.estimated_amount123) total += item.estimated_amount123;
        if (item.estimated_amount124) total += item.estimated_amount124;
        if (item.estimated_amount125) total += item.estimated_amount125;
        if (item.estimated_amount1239) total += item.estimated_amount1239;
        if (item.estimated_amount1qq) total += item.estimated_amount1qq;
        if (item.estimated_amount100) total += item.estimated_amount100;
        if (item.estimated_amount101) total += item.estimated_amount101;
        if (item.estimated_amount102) total += item.estimated_amount102;
        if (item.estimated_amount103) total += item.estimated_amount103;
        if (item.estimated_amount104) total += item.estimated_amount104;
        if (item.estimated_amount105) total += item.estimated_amount105;
        if (item.estimated_amount106) total += item.estimated_amount106;
        if (item.estimated_amount107) total += item.estimated_amount107;
        if (item.estimated_amount137) total += item.estimated_amount137;
        if (item.estimated_amount108) total += item.estimated_amount108;
        if (item.estimated_amount109) total += item.estimated_amount109;
        if (item.estimated_amount110) total += item.estimated_amount110;
        if (item.estimated_amount112) total += item.estimated_amount112;
        if (item.estimated_amount113) total += item.estimated_amount113;
        if (item.estimated_amount115) total += item.estimated_amount115;
        if (item.estimated_amount116) total += item.estimated_amount116;
        if (item.estimated_amount117) total += item.estimated_amount117;
        if (item.estimated_amount118) total += item.estimated_amount118;
        if (item.estimated_amount119) total += item.estimated_amount119;
        if (item.estimated_amount1255) total += item.estimated_amount1255;
        if (item.estimated_amount1241) total += item.estimated_amount1241;
        if (item.estimated_amount127) total += item.estimated_amount127;
        if (item.estimated_amount128) total += item.estimated_amount128;
        if (item.estimated_amount129) total += item.estimated_amount129;
        if (item.estimated_amount130) total += item.estimated_amount130;
        if (item.estimated_amount131) total += item.estimated_amount131;
        if (item.estimated_amount133) total += item.estimated_amount133;
        if (item.estimated_amount134) total += item.estimated_amount134;
        if (item.estimated_amount135) total += item.estimated_amount135;
        if (item.estimated_amount136) total += item.estimated_amount136;
    });

    frm.set_value('total_estimated_cost', total);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////