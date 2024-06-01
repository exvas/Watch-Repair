
// frappe.ui.form.on("Item",{
//     refresh:function(){
//         console.log("rrrrrrrrrrrrrrrrrrrr")
//         frm.set_query('custom_category', function() {
// 			return {
// 				filters: {
// 					company: frm.doc.item_group
// 				}
// 			};
// 		});

        
//     },
    
   
// // });
// frappe.ui.form.on("Item", {
//     refresh: function(frm) {
//         // Log message to console for debugging
//         console.log("Refresh function triggered");

//         // Setting query for custom_category field
//         frm.set_query('custom_category', function() {
//             // Get the selected item_group
//             let item_group = frm.doc.item_group;
//             if (!item_group) {
//                 return {};
//             }

//             // Fetch categories from the selected item group
//             return {
//                 query: 'watch_repair.doc_events.item.get_categories_for_item_group',
//                 filters: {
//                     item_group: item_group
//                 }
//             };
//         });
//     }
// });




// frappe.ui.form.on("Item", {
//     refresh: function(frm) {
//         // Log message to console for debugging
//         console.log("Refresh function triggered");

//         // Setting query for custom_category field
//         frm.set_query('custom_category', function() {
//             // Get the selected item_group
//             let item_group = frm.doc.item_group;
//             if (!item_group) {
//                 return {};
//             }

//             // Fetch categories from the selected item group
//             return {
//                 query: 'watch_repair.doc_events.item.get_categories_for_item_group',
//                 filters: {
//                     item_group: item_group
//                 }
//             };
//         });
//     }
// });



frappe.ui.form.on("Item", {
    refresh: function(frm) {
        // Log message to console for debugging
        console.log("Refresh function triggered");

        // Setting query for custom_category field
        frm.set_query('custom_category', function() {
            // Get the selected item_group
            let item_group = frm.doc.item_group;
            if (!item_group) {
                return {};
            }

            // Fetch categories from the selected item group
            return {
                query: 'watch_repair.doc_events.item.get_categories_for_item_group',
                filters: {
                    item_group: item_group
                },
                callback: function(response) {
                    // Set the options for custom_category field based on the response
                    frm.set_df_property('custom_category', 'options', response);
                }
            };
        });
    }
});

