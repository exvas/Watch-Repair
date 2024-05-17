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
		  
  
		  frm.add_custom_button(('Close'), function() {
			  frappe.msgprint(('Close button clicked'));
			  frm.set_value('status', 'Closed');
			  frm.save();
		  });
  
		  frm.add_custom_button(('Open'), function() {
			  frappe.msgprint(('Open button clicked'));
			  frm.set_value('status', 'Pending');
			  frm.save();
		  });
	  frm.add_custom_button(('Repair Order'), function() {
			  frappe.msgprint(('Repair Order clicked'));
		  }, 'Create');
  
		  frm.add_custom_button(('Create Service'), function() {
			  frappe.msgprint(('Service clicked'));
		  }, 'Create');
	  
  
  
  
  
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
 