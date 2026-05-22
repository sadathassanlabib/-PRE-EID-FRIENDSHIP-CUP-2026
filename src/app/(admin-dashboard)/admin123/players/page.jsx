// 'use client'

// import React, { useState, useEffect, useCallback } from 'react'
// import API from '../../../../lib/mongodb'
// import Btn from '../../../components/Btn'
// import Modal from '../../../components/Modal'
// import Field from '../../../components/Field'
// // make sure these exist in your project
// // import Modal from '@/components/Modal'
// // import Btn from '@/components/Btn'
// // import Field from '@/components/Field'

// const defaultPlayer = {
//   name: '',
//   position: 'Striker',
//   category: 'A',
//   team: '',
//   isCaptin: false,
//   goals: 0,
//   assists: 0,
// }

// export default function PlayersSection({ toast }) {
//   const [players, setPlayers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [modal, setModal] = useState(null) // null | 'add' | 'edit'
//   const [form, setForm] = useState(defaultPlayer)
//   const [editId, setEditId] = useState(null)
//   const [filter, setFilter] = useState('ALL')

//   // LOAD
//   const load = useCallback(async () => {
//     setLoading(true)
//     try {
//       const data = await API.get('/api/players')
//       setPlayers(Array.isArray(data) ? data : [])
//     } catch (err) {
//       console.log(err)
//     }
//     setLoading(false)
//   }, [])

//   useEffect(() => {
//     load()
//   }, [load])

//   // OPEN ADD
//   const openAdd = () => {
//     setForm(defaultPlayer)
//     setEditId(null)
//     setModal('add')
//   }

//   // OPEN EDIT
//   const openEdit = (p) => {
//     setForm({
//       name: p.name || '',
//       position: p.position || 'Striker',
//       category: p.category || 'A',
//       team: p.team || '',
//       isCaptin: p.isCaptin || false,
//       goals: p.goals || 0,
//       assists: p.assists || 0,
//     })
//     setEditId(p._id)
//     setModal('edit')
//   }

//   // SAVE
//   const save = async () => {
//     if (!form.name.trim()) return toast('Name is required', 'error')

//     try {
//       if (modal === 'add') {
//         await API.post('/api/players', form)
//         toast('Player added!', 'success')
//       } else {
//         await API.put(`/api/players/${editId}`, form)
//         toast('Player updated!', 'success')
//       }

//       setModal(null)
//       setForm(defaultPlayer)
//       load()
//     } catch (err) {
//       toast('Something went wrong', 'error')
//     }
//   }

//   // DELETE
//   const remove = async (id) => {
//     if (!confirm('Delete this player?')) return

//     try {
//       await API.del(`/api/players/${id}`)
//       toast('Player deleted', 'success')
//       load()
//     } catch (err) {
//       toast('Delete failed', 'error')
//     }
//   }

//   // FILTER
//   const visible =
//     filter === 'ALL'
//       ? players
//       : players.filter((p) => p.category === filter)

//   return (
//     <div>

//       {/* TOP BAR */}
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: 20,
//           flexWrap: 'wrap',
//           gap: 12,
//         }}
//       >

//         {/* FILTERS */}
//         <div style={{ display: 'flex', gap: 8 }}>
//           {['ALL', 'A', 'B', 'C', 'D'].map((c) => (
//             <button
//               key={c}
//               onClick={() => setFilter(c)}
//               style={{
//                 padding: '6px 14px',
//                 borderRadius: 20,
//                 border: 'none',
//                 fontWeight: 700,
//                 fontSize: 13,
//                 cursor: 'pointer',
//                 background: filter === c ? '#3b82f6' : '#1a1a2e',
//                 color: '#fff',
//               }}
//             >
//               {c === 'ALL' ? 'All' : `Cat ${c}`}
//             </button>
//           ))}
//         </div>

//         {/* ADD */}
//         <Btn onClick={openAdd} color="#22c55e">
//           + Add Player
//         </Btn>
//       </div>

//       {/* LIST */}
//       {loading ? (
//         <p style={{ color: '#888', textAlign: 'center' }}>
//           Loading players…
//         </p>
//       ) : (
//         <div style={{ display: 'grid', gap: 10 }}>
//           {visible.map((p) => (
//             <div
//               key={p._id}
//               style={{
//                 background: '#0f0f23',
//                 border: '1px solid #2a2a4a',
//                 borderRadius: 12,
//                 padding: '14px 18px',
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 flexWrap: 'wrap',
//                 gap: 8,
//               }}
//             >

//               <div>
//                 <span style={{ color: '#fff', fontWeight: 700 }}>
//                   {p.isCaptin && '👑 '}
//                   {p.name}
//                 </span>

//                 <span
//                   style={{
//                     marginLeft: 10,
//                     fontSize: 12,
//                     color: '#60a5fa',
//                     background: '#1e3a5f',
//                     borderRadius: 4,
//                     padding: '2px 8px',
//                   }}
//                 >
//                   Cat {p.category}
//                 </span>

//                 <span
//                   style={{
//                     marginLeft: 6,
//                     fontSize: 12,
//                     color: '#a78bfa',
//                     background: '#2d1b69',
//                     borderRadius: 4,
//                     padding: '2px 8px',
//                   }}
//                 >
//                   {p.position}
//                 </span>

//                 {p.team && (
//                   <span style={{ marginLeft: 6, fontSize: 12, color: '#888' }}>
//                     • {p.team}
//                   </span>
//                 )}

//                 <div style={{ marginTop: 4, fontSize: 12, color: '#888' }}>
//                   ⚽ {p.goals} goals &nbsp;|&nbsp; 🎯 {p.assists} assists
//                 </div>
//               </div>

//               <div>
//                 <Btn small onClick={() => openEdit(p)}>
//                   Edit
//                 </Btn>

//                 <Btn small danger onClick={() => remove(p._id)}>
//                   Delete
//                 </Btn>
//               </div>
//             </div>
//           ))}

//           {visible.length === 0 && (
//             <p style={{ color: '#888', textAlign: 'center' }}>
//               No players found.
//             </p>
//           )}
//         </div>
//       )}

//       {/* MODAL */}
//       {modal && (
//        <Modal
//   title={modal === 'add' ? '⚽ Add New Player' : '✏️ Edit Player'}
//   onClose={() => setModal(null)}
// >
//   <div style={container}>

//     {/* NAME */}
//     <Field label="Player Name">
//       <input
//         style={input}
//         placeholder="e.g. Tamim Rahman"
//         value={form.name}
//         onChange={(e) =>
//           setForm({ ...form, name: e.target.value })
//         }
//       />
//     </Field>

//     {/* POSITION + CATEGORY */}
//     <div style={grid}>

//       <Field label="Position">
//         <select
//           style={input}
//           value={form.position}
//           onChange={(e) =>
//             setForm({ ...form, position: e.target.value })
//           }
//         >
//           <option>Striker ⚽</option>
//           <option>Midfielder 🎯</option>
//           <option>Defender 🛡️</option>
//           <option>Goalkeeper 🧤</option>
//         </select>
//       </Field>

//       <Field label="Category">
//         <select
//           style={input}
//           value={form.category}
//           onChange={(e) =>
//             setForm({ ...form, category: e.target.value })
//           }
//         >
//           {['A', 'B', 'C', 'D'].map((c) => (
//             <option key={c}>Cat {c}</option>
//           ))}
//         </select>
//       </Field>

//     </div>

//     {/* TEAM */}
//     <Field label="Team Name">
//       <input
//         style={input}
//         placeholder="Optional team name"
//         value={form.team}
//         onChange={(e) =>
//           setForm({ ...form, team: e.target.value })
//         }
//       />
//     </Field>

//     {/* STATS */}
//     <div style={grid}>

//       <Field label="Goals ⚽">
//         <input
//           style={input}
//           type="number"
//           min="0"
//           value={form.goals}
//           onChange={(e) =>
//             setForm({ ...form, goals: +e.target.value })
//           }
//         />
//       </Field>

//       <Field label="Assists 🎯">
//         <input
//           style={input}
//           type="number"
//           min="0"
//           value={form.assists}
//           onChange={(e) =>
//             setForm({ ...form, assists: +e.target.value })
//           }
//         />
//       </Field>

//     </div>

//     {/* CAPTAIN */}
//     <label style={checkBox}>
//       <input
//         type="checkbox"
//         checked={form.isCaptin}
//         onChange={(e) =>
//           setForm({ ...form, isCaptin: e.target.checked })
//         }
//       />
//       <span>👑 Mark as Captain</span>
//     </label>

//     {/* BUTTONS */}
//     <div style={btnRow}>

//       <Btn onClick={save} color="#22c55e" full>
//         🚀 Save Player
//       </Btn>

//       <Btn onClick={() => setModal(null)} color="#374151" full>
//         Cancel
//       </Btn>

//     </div>

//   </div>
// </Modal>
//       )}

//     </div>
//   )
// }