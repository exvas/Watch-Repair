

// frappe.ui.form.on('Item', {
//     item_group: function(frm) {
//         if (frm.doc.item_group) {
//             frappe.call({
//                 method: 'watch_repair.doc_events.item.get_categories',
//                 args: {
//                     item_group: frm.doc.item_group
//                 },
//                 callback: function(response) {
//                     if (response.message) {
//                         // Clear the existing options
//                         frm.set_df_property('custom_category', 'options', []);
//                         // Add the new options from the response
//                         frm.set_df_property('custom_category', 'options', response.message);
//                         frm.refresh_field('custom_category');
//                     }
//                 }
//             });
//         } else {
//             frm.set_df_property('custom_category', 'options', []);
//             frm.refresh_field('custom_category');
//         }
//     }
// });



frappe.ui.form.on('Item', {
    item_group: function(frm) {
        if (frm.doc.item_group) {
            frappe.call({
                method: 'watch_repair.doc_events.item.get_categories',
                args: {
                    item_group: frm.doc.item_group
                },
                callback: function(response) {
                    if (response.message) {
                        // Apply the filter to the custom_category field
                        frm.set_query('custom_category', function() {
                            return {
                                filters: [
                                    ['Category', 'name', 'in', response.message]
                                ]
                            };
                        });
                        frm.refresh_field('custom_category');
                    }
                }
            });
        } else {
            frm.set_query('custom_category', function() {
                return {
                    filters: [
                        ['Category', 'name', 'in', []]
                    ]
                };
            });
            frm.refresh_field('custom_category');
        }
    }
});
