frappe.ui.form.on('Contact', {
    refresh(frm) {
        frappe.db.get_single_value('Knowlarity Settings', 'enabled').then(function(knowlarity_enabled_name) {
            if (knowlarity_enabled_name) {
        frm.add_custom_button(__('Make a Call'), function () {
                var fields = [
                    {
                        fieldtype: 'Data',
                        fieldname: 'isselect',
                        label: 'Enter +Country_Code and Mobile No  E.g. +919000008877',
                        default: '+'+(frm.doc.primary_mobile ? frm.doc.primary_mobile : frm.doc.mobile_no),
                    }
                ];
                
                    fields.push({
                        fieldtype: 'Button',
                        label: '<img src="https://images.saasworthy.com/tr:w-178,h-0/knowlarity_672_logo_1604302759_o40ev.jpg" style="width:20px; height:20px;">  Knowlarity ',
                        click: function() {
                            var values = d.get_values();
                            if (!values) {
                                // Handle the case where values are not available
                                console.error("Error: Values are not available.");
                                return;
                            }
        
                            // Access the 'isselect' field value and print it
                            var isselectValue = values.isselect;
                    
                            console.log('isselect field value:', isselectValue);
                            if(isselectValue==='+'){
                                frappe.call({
                                    method: "knowlarity.api.get_contact",
                                    args: { "userid": frm.doc.email_id },
                                    callback: function(r) {}
                                });
    
                                frappe.show_alert({
                                    message: __('Calling ...'),
                                    indicator: 'green'
                                }, 10);
    
                                d.hide();
                            }
                            else{
                                frappe.call({
                                    method: "knowlarity.api.make_call",
                                    args: { "primary_mobile": isselectValue },
                                    callback: function(r) {}
                                });
            
                                frm.save();
                                frappe.show_alert({
                                    message: __('Calling ...'),
                                    indicator: 'green'
                                }, 10);
            
                                d.hide();
                            }
                            
                        }
                    });
                

                var d = new frappe.ui.Dialog({
                    title: 'Choose Calling Platform',
                    fields: fields
                });

                d.show();
            
        }, __("Call"));
        frm.add_custom_button(__('Get Call History'), function () {
            frappe.call({
                method:"knowlarity.api.get_call_details",
                args:{"primary_mobile":(frm.doc.primary_mobile ? frm.doc.primary_mobile : frm.doc.mobile_no)},
                callback:function(r){}
            });
        
            var previousUrl = window.location.href;
            frappe.set_route('Report', 'Knowlarity Call Logs');
            window.history.replaceState({}, document.title, previousUrl);
            window.onpopstate = function(event) {
              window.location.href = previousUrl;
            };
        }, __("Call"));
    }
    }).catch(function(error) {
        console.log("Error fetching knowlarity_enabled_name:", error);
    });
    }
});
