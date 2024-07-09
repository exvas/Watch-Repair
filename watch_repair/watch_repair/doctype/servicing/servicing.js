// Copyright (c) 2024, sammish and contributors
// For license information, please see license.txt



var itemname1=''



frappe.ui.form.on('Servicing', {
	refresh: function(frm) {

        cur_frm.set_query("item", "job_work_item", (frm, cdt, cdn) => {
			let d = locals[cdt][cdn];
            return {
                "filters": {
					"custom_is_customer_item":0,
				}
			}
        })

        frappe.db.get_doc("Watch Service Settings")
            .then(doc => {
                let itemGroups = [];

                // Loop through the 'group' child table
                if (doc.group && doc.group.length > 0) {
                    doc.group.forEach(row => {
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






        // frm.fields_dict['job_work_item'].grid.get_field('item').get_query = function() {
        //     return {
        //         filters: {
        //             'custom_allow_in_servicing': 1
        //         }
        //     };
        // };


        if (cur_frm.doc.status === 'Pending') {
            frm.add_custom_button(__('Close'), function() {

                if (!cur_frm.doc.closing_reason) {
                    frappe.msgprint(__("Close Reason is mandatory."));
                    return;
                }

                console.log("Document Closed")
                cur_frm.call({
                    doc: cur_frm.doc,
                    method: 'close',
                    args: {},
                    callback: function(response) {
                        if (!response.exc) {
                            cur_frm.reload_doc();
                        }
                    }
                    
                });
            });
        }
            $('button[data-label="Close"]').addClass('btn-danger').addClass('btn-3d-effect'); 

        // // CSS for btn-3d-effect class
        // $('head').append('<style>' +
        //     '.btn-3d-effect {' +
        //     '   background-color: black; /* Change background color as needed */' +
        //     // '   border: 1px solid #333; /* Change border color as needed */' +
        //     '   box-shadow: 0 4px rgba(0, 0, 0, 0.6); /* Adjust box shadow for 3D effect */' +
        //     '   transition: background-color 0.3s, box-shadow 0.3s;' + 
        //     '}' +
        //     '.btn-3d-effect:hover {' +
        //     '   background-color: #c9302c; /* Change hover background color as needed */' +
        //     '   box-shadow: 0 2px #91211b; /* Adjust hover box shadow for depth */' +
        //     '}' +
        //     '</style>');
    },

 
    
  
});



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
                        frappe.model.set_value(d.doctype,d.name,"qty", "1");
                        frm.refresh_field('job_work_item');
                    }
                }
            });
        }
    },



});


   