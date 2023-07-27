frappe.ui.form.on('Lead', {
    refresh(frm) {
        frm.add_custom_button(__('Knowlarity'), function () {
            frappe.db.get_single_value('Knowlarity Settings', 'enabled').then(function(knowlarity_enabled_name) {
                var fields = [];
                if (knowlarity_enabled_name) {
                    fields.push({
                        fieldtype: 'Button',
                        label: '<img src="https://images.saasworthy.com/tr:w-178,h-0/knowlarity_672_logo_1604302759_o40ev.jpg" style="width:20px; height:20px;">  Knowlarity ',
                        click: function() {
                            frappe.call({
                                method: "knowlarity.api.make_call",
                                args: { "primary_mobile": (frm.doc.primary_mobile ? frm.doc.primary_mobile : frm.doc.mobile_no) },
                                callback: function(r) {}
                            });

                            frappe.show_alert({
                                message: __('Calling ...'),
                                indicator: 'green'
                            }, 10);

                            d.hide();
                        }
                    });
                }

                var d = new frappe.ui.Dialog({
                    title: 'Choose Calling Platform',
                    fields: fields
                });

                d.show();
            })
            .catch(function(error) {
                console.log("Error fetching knowlarity_enabled_name:", error);
            });
        }, __("Call"));
        frm.add_custom_button(__('Get History'), function () {
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
});

