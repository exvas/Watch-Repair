
 
 
var itemname1=''

 

frappe.ui.form.on('Job Work', {


    refresh: function(frm) {
        frappe.db.get_doc("Watch Service Settings")
            .then(doc => {
                let itemGroups = [];

                // Loop through the 'group' child table
                if (doc.group_2 && doc.group_2.length > 0) {
                    doc.group_2.forEach(row => {
                        itemGroups.push(row.item_group);
                    });
                }

                // Set the query for the 'item' field in the 'job_work_item' child table
                frm.set_query("item", "job_work_item", function() {
                    return {
                        filters: [
                            ["item_group", "in", itemGroups]
                        ]
                    };
                });
            });
            frappe.db.get_doc("Watch Service Settings")
            .then(doc => {
                let itemGroups = [];

                // Loop through the 'group' child table
                if (doc.group_3 && doc.group_3.length > 0) {
                    doc.group_3.forEach(row => {
                        itemGroups.push(row.item_group);
                    });
                }

                // Set the query for the 'item' field in the 'job_work_item' child table
                frm.set_query("item", "job", function() {
                    return {
                        filters: [
                            ["item_group", "in", itemGroups]
                        ]
                    };
                });
            });




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

    total: function(frm) {
        // Debugging statement to log the current state of frm.doc
        console.log(frm.doc);
    
        let jobWorkItemHasItem = false;
        let jobHasItem = false;
    
        // Check if any row in the job_work_item child table has the item field set
        if (frm.doc.job_work_item) {
            frm.doc.job_work_item.forEach(function(row) {
                if (row.item) {
                    jobWorkItemHasItem = true;
                }
            });
        }
    
        // Check if any row in the job child table has the item field set
        if (frm.doc.job) {
            frm.doc.job.forEach(function(row) {
                if (row.item) {
                    jobHasItem = true;
                }
            });
        }
    
        // Debugging statement to log the results of the checks
        console.log("jobWorkItemHasItem: ", jobWorkItemHasItem);
        console.log("jobHasItem: ", jobHasItem);
    
        if (jobWorkItemHasItem && jobHasItem) {
            console.log("abcdefg");
            // Set 'add_additional_cost' to 1 (checked)
            frm.set_value('add_additional_cost', 1);
            var a = frm.doc.total;
    
            // Set 'additional_cost' to the value of 'total'
            frm.set_value('additional_cost', a);
        } else {
            console.log("else");
            // Set 'service_only' to 1 (checked)
            frm.set_value('service_only', 1);
            var a = frm.doc.total;
    
            // Set 'service_cost' to the value of 'total'
            frm.set_value('service_cost', a);
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

frappe.ui.form.on('Job Work Item', {



    item: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        if (d.item) {
            cur_frm.call({
                doc: cur_frm.doc,
                method: 'get_item',
                args: {
                    item: d.item,
                },
                callback: function(r) {
                    if (r.message) {
                        frappe.model.set_value(d.doctype,d.name,"available_qty",r.message[0].actual_qty);
                        frappe.model.set_value(d.doctype,d.name,"valuation_rate",r.message[0].valuation_rate);
                        frm.refresh_field('job_work_item');
                    }
                }
            });
        }
    },



});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

frappe.ui.form.on('Services', {

    // item: function(frm, cdt, cdn) {
    //     var d = locals[cdt][cdn];
    //     if (d.item) {
          
              
    //             frappe.model.set_value(d.doctype, d.name, "amount", d.qty * d.rate);
                
    //             frm.refresh_field("job");
    //     }
    // },
    qty: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        if (d.item) {
          
              
                frappe.model.set_value(d.doctype, d.name, "amount", d.qty * d.rate);
                
                frm.refresh_field("job");
        }
    },
    rate: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        if (d.item) {
          
              
                frappe.model.set_value(d.doctype, d.name, "amount", d.qty * d.rate);
                
                frm.refresh_field("job");
        }
    },


});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////




frappe.ui.form.on("Services", {
	refresh(frm) {

	},

    amount: function(frm,cdt,cdn){
        var d =locals[cdt][cdn];
        var k = 0;
        frm.doc.job.forEach(function(d) {
            k += d.amount;
            
        });
        frm.set_value('total', k);
        frm.refresh_field("total")
        
    },
  

    

});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

frappe.ui.form.on("Services","job_remove",function(frm,cdt,cdn){
	var d=locals[cdt][cdn];
	var s=0;
	frm.doc.job.forEach(function(d){
		s+=d.amount;
	});
	frm.set_value('total',s)
	frm.refresh_field("total")
	
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
