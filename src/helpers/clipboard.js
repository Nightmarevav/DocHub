import env from './env';


function fallbackCopyTextToClipboard(text) {
	var textArea = document.createElement('textarea');
	textArea.value = text;
    
	// Avoid scrolling to bottom
	textArea.style.top = '0';
	textArea.style.left = '0';
	textArea.style.position = 'fixed';
  
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
  
	try {
		document.execCommand('copy');
	} catch (err) {
		// eslint-disable-next-line no-console        
		console.error('Fallback: Oops, unable to copy', err);
	}
  
	document.body.removeChild(textArea);
}

export default function(text)  {
	if (env.isPlugin()) {
		window.$PAPI.copyToClipboard(text);
	} else {
		if (!navigator.clipboard) {
			fallbackCopyTextToClipboard(text);
			return;
		}
		navigator.clipboard.writeText(text).then(function() {
		}, function(err) {
			// eslint-disable-next-line no-console        
			console.error('Async: Could not copy text: ', err);
		});
	}
}

