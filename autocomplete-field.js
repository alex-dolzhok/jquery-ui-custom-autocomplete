(function($) {
	$.fn.autocompleteField = function(methodOrOptions) {
		const methods = {
			init: init,
			saveValue: saveValue,
			removeItem: removeItem,
			removeAllItems: removeAllItems
		};
		
		return this.each(function() {
			if (methods[methodOrOptions]) {
				return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
			} else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
				// Default to "init"
				return methods.init.apply(this, arguments);
			} else {
				$.error('Method ' +  methodOrOptions + ' does not exist on jQuery.autocompleteField');
			}
		});
	
		function init(options) {
			let settings = $.extend({
				source: [],
				storagePrefix: ''
			}, options);
			
			let sourceItems = settings.source;
			const storageKey = settings.storagePrefix + '.autocomplete';
			
			if (sourceItems.length == 0) {
				sourceItems = getLocalStorageItems(storageKey);
			}
			
			$(this).autocomplete({
				source: sourceItems,
				select: function (event, ui) {
					// console.log(`selected item: ${ui.item.value}`);
				},
				change: function (event, ui) {
					// if (ui.item != null) return;
					// const value = $(this).val();
				}
			}).data({ sourceItems: sourceItems, storageKey: storageKey });
		}
		
		function saveValue() {
			const value = $(this).val();
			const data = $(this).data();
			const sourceItems = data.sourceItems;
			const storageKey = data.storageKey;
			
			if (!value) {
				return;
			}
			
			const filteredValue = sourceItems.filter(x => x == value);
			
			if (filteredValue.length == 0) {
				sourceItems.push(value);
			}
			
			setLocalStorageItems(storageKey, sourceItems);
		}

		function removeItem() {
			const value = $(this).val();
			const data = $(this).data();
			const sourceItems = data.sourceItems;
			const storageKey = data.storageKey;

			if (!value) {
				return;
			}

			const itemIndex = sourceItems.indexOf(value);

			if (itemIndex > -1) {
				sourceItems.splice(itemIndex, 1);
			}

			setLocalStorageItems(storageKey, sourceItems);
			$(this).val('');
		}

		function removeAllItems() {
			const data = $(this).data();
			const sourceItems = data.sourceItems;
			const storageKey = data.storageKey;

			sourceItems.length = 0;
			setLocalStorageItems(storageKey, sourceItems);
			$(this).val('');
		}
		
		function getLocalStorageItems(key) {
			var storageItems = localStorage.getItem(key);
			if (!storageItems) {
				return [];
			}
			
			return JSON.parse(storageItems);
		}
		
		function setLocalStorageItems(key, items) {
			localStorage.setItem(key, JSON.stringify(items));
		}
	};
})(jQuery);
