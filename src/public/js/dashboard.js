// dashboard.js - attach event listeners rather than inline handlers

async function addLinkHandler(ev) {
  ev.preventDefault();
  const submitBtn = document.getElementById('submitBtn');
  const msg = document.getElementById('formMsg');
  submitBtn.disabled = true;
  msg.textContent = 'Saving...';
  const target_url = document.getElementById('target_url').value;
  const code = document.getElementById('code').value || undefined;

  try {
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_url, code })
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({ error: 'Unknown error' }));
      msg.textContent = err.error || 'Error';
      submitBtn.disabled = false;
      return;
    }
    const created = await res.json();
    msg.textContent = 'Created ' + created.code;
    setTimeout(()=> location.reload(), 600);
  } catch (err) {
    msg.textContent = 'Network error';
    submitBtn.disabled = false;
  }
}

async function deleteLink(code, rowEl) {
  if (!confirm('Delete ' + code + '?')) return;
  try {
    const res = await fetch('/api/links/' + encodeURIComponent(code), { method: 'DELETE' });
    if (res.status === 204 || res.status === 200) {
      if (rowEl) rowEl.remove();
      else location.reload();
    } else {
      const j = await res.json().catch(()=>({ error: 'Error' }));
      alert(j.error || 'Error');
    }
  } catch (err) {
    alert('Network error');
  }
}

function copyLink(url){
  if (!navigator.clipboard) {
    prompt('Copy this link:', url);
    return;
  }
  navigator.clipboard.writeText(url).then(()=> {
    // small non-blocking notification
    alert('Copied: ' + url);
  }).catch(()=> alert('Unable to copy'));
}

document.addEventListener('DOMContentLoaded', () => {
  // form submit
  const form = document.getElementById('add-form');
  if (form) form.addEventListener('submit', addLinkHandler);

  // copy buttons
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const code = btn.dataset.code;
      const base = window.location.origin || '';
      copyLink(base + '/' + code);
    });
  });

  // delete buttons
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const code = btn.dataset.code;
      // find the row element to remove on success
      const row = document.getElementById('row-' + code);
      deleteLink(code, row);
    });
  });
});
