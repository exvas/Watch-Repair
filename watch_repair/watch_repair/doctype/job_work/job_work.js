
 
 
 

frappe.ui.form.on('Job Work', {


    refresh: function(frm) {

        if (cur_frm.doc.docstatus === 1 && cur_frm.doc.status === 'Servicing Completed' && cur_frm.doc.stock_entry_status !== 'Stock Entry Created') {
			frm.add_custom_button(__('Stock Entry '), function() {
                console.log("stock entry created")
                cur_frm.call({
                    doc: cur_frm.doc,
                    method: 'create_stock_entry',
                    args: {
                    },
                    callback: function(response) {
                        frappe.set_route("Form", "Stock Entry", response.message);                  
                    }
                });
            
            }, __("Create"));
		}

        if (cur_frm.doc.status === 'To Invoice') {
			frm.add_custom_button(__('Sales Invoice '), function() {
                console.log("testing")
                cur_frm.call({
                    doc: cur_frm.doc,
                    method: 'create_sales_invoice',
                    args: {
                    },
                    callback: function(response) {
                        frappe.set_route("Form", "Sales Invoice", response.message);                  
                    }
                });
            
            }, __("Create"));
		}

        if (cur_frm.doc.service_warranty === 'Warranty Not Create' && cur_frm.doc.docstatus === 1 && cur_frm.doc.status === 'Completed') {
			frm.add_custom_button(__('Service Warranty'), function() {
                console.log("testing")
                cur_frm.call({
                    doc: cur_frm.doc,
                    method: 'create_service_warranty',
                    args: {
                    },
                    callback: function(response) {
                        frappe.set_route("Form", "Service Warranty", response.message);                  
                    }
                });
            
            }, __("Create"));
		}
        // if (frm.doc.docstatus === 1) {
        //     // Add a custom button named 'Whatsapp' next to the Save button
        //     frm.add_custom_button(__('Send Whatsapp Notification'), function() {
                
        //         let mobile_number = frm.doc.whats_app_number;
                
        //         // Check if the mobile number is present
        //         if (!mobile_number) {
        //             frappe.msgprint(__('Please Enter The Customer Whats App Number.'));
        //             return;
        //         }
                
        //         // Construct the WhatsApp URL with the mobile number and message
        //         let whatsapp_url = `https://wa.me/${mobile_number}?text=Hi`;

        //         // Open the WhatsApp Web URL in a new browser tab
        //         window.open(whatsapp_url, '_blank');
        //     });
        // }
        if (frm.doc.docstatus === 1) {
            // Add a custom button named 'Send Whatsapp Notification' next to the Save button
            frm.add_custom_button(__('Send Whatsapp Notification'), function() {
                
                let mobile_number = frm.doc.whats_app_number;
                
                // Check if the mobile number is present
                if (!mobile_number) {
                    frappe.msgprint(__('Please Enter The Customer Whats App Number.'));
                    return;
                }
                
                // Construct the message with dynamic content
                let message = `Dear ${frm.doc.customer}, Your ${frm.doc.service_item_name}, Model Number ${frm.doc.model_no}, Serial No ${frm.doc.serial_no}, Service Has been Completed. Please Collect Your ${frm.doc.service_item_name} From Our ${frm.doc.company}. - Thank you -`;

                // Encode the message for the URL
                let encoded_message = encodeURIComponent(message);
                
                // Construct the WhatsApp URL with the mobile number and encoded message
                let whatsapp_url = `https://wa.me/${mobile_number}?text=${encoded_message}`;

                // Open the WhatsApp Web URL in a new browser tab
                window.open(whatsapp_url, '_blank');
            });
        }

    },


    get_servicing_meterials: function(frm) {
        if (frm.doc.customer && frm.doc.service_item && frm.doc.repair_order) {
            cur_frm.call({
                doc: cur_frm.doc,
                method: 'get_linked_data',
                args: {
                    customer: frm.doc.customer,
                    service_item: frm.doc.service_item,
                    repair_order: frm.doc.repair_order
                },
                callback: function(r) {
                    if (r.message) {
                        if (r.message.submitted_data && r.message.submitted_data.length > 0) {
                            frm.clear_table("job_work_item");
                            $.each(r.message.submitted_data, function(i, d) {
                                var row = frappe.model.add_child(frm.doc, "Job Work Item", "job_work_item");
                                row.item = d.item;
                                row.item_name = d.item_name;
                                row.uom = d.uom;
                                row.qty = d.qty;
                                row.available_qty = d.available_qty;
                                row.valuation_rate = d.valuation_rate;
                            });
                            frm.refresh_field("job_work_item");
                        }
    
                        if (r.message.unsubmitted_data && r.message.unsubmitted_data.length > 0) {
                            let unsubmitted_names = r.message.unsubmitted_data.map(d => d.name).join(", ");
                            frappe.msgprint(`The Status of The ${unsubmitted_names} Servicing Are Pending. Please submit these document(s).`);
                        }
    
                        if ((!r.message.submitted_data || r.message.submitted_data.length === 0) && 
                            (!r.message.unsubmitted_data || r.message.unsubmitted_data.length === 0)) {
                            frappe.msgprint("No Service Materials found, Please enbale Service Only check box");

                            frm.set_value('service_only', 1);
                            frm.refresh_field('service_only');
                        }
                    } else {
                        frappe.msgprint("No servicing documents found.");
                    }
                }
            });
        } else {
            frappe.msgprint("Please fill in Customer, Service Item and Repair Order");
        }
    },
    
 
    
    // before_submit: function(frm) {
    //     if (frm.doc.service_only) {
    //         cur_frm.call({
    //             doc: cur_frm.doc,
    //             method: 'get_linked_data',
    //             args: {
    //                 customer: frm.doc.customer,
    //                 service_item: frm.doc.service_item,
    //                 repair_order: frm.doc.repair_order
    //             },
    //             callback: function(r) {
    //                 if (r.message.unsubmitted_data && r.message.unsubmitted_data.length > 0) {
    //                     frappe.msgprint("There are pending servicing documents. Please submit all servicing documents before submitting this document.");
    //                     frappe.validated = false;
    //                 }
    //             }
    //         });
    //     }
    // },

    before_submit: function(frm) {
        console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")

        
        cur_frm.call({
            doc: cur_frm.doc,
            method: 'get_linked_data',
            args: {
                customer: frm.doc.customer,
                service_item: frm.doc.service_item,
                repair_order: frm.doc.repair_order
            },
            callback: function(r) {
                if (r.message.unsubmitted_data && r.message.unsubmitted_data.length > 0) {
                    frappe.msgprint("There are pending servicing documents. Please submit all servicing documents before submitting this document.");
                    frappe.validated = false;
                }
            }
        });
        
    },


    validate: function(frm){
        console.log("validate check ---------")
        if (frm.doc.is_return ) {
            frm.set_value('status', 'Return');
           
            // frappe.prompt(
            //     [
            //         {
            //             label: 'Return Reason',
            //             fieldname: 'return_reason',
            //             fieldtype: 'Small Text',
            //             reqd: 1
            //         }
            //     ],
            //     function(values){
                    // frm.set_value('return_reason', values.return_reason);
                    // frm.save_or_update();
                    cur_frm.call({
                        doc: cur_frm.doc,
                        method: 'isreturn',
                        args: {
                            // return_reason: values.return_reason
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
                // },
                // 'Return Reason',
                // 'Submit Return'
            // );
        }
        if(frm.doc.service_only==1){

            if (frm.doc.service_cost === 0) {
                frappe.msgprint(__('Please enter a non-zero amount for Service Cost'));
                frappe.validated = false;
            }
        }
    },
    
});

