import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PositionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [maxProjects, setMaxProjects] = useState(3);
  const [tagInput, setTagInput] = useState('');
  const [deadline, setDeadline] = useState('');
  const [projectTags, setProjectTags] = useState([]);
  const [version, setVersion] = useState(1);

  const [allAttributes, setAllAttributes] = useState([]);
  const [selectedAttributeIds, setSelectedAttributeIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddingAttribute, setIsAddingAttribute] = useState(false);
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrType, setNewAttrType] = useState('TEXT');

  const fetchGlobalAttributes = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/attribute/all');
      if (res.ok) {
        const data = await res.json();
        setAllAttributes(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGlobalAttributes();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    const loadPositionData = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/position/all');
        if (res.ok) {
          const positions = await res.json();
          const target = positions.find(p => p.id === parseInt(id));
          if (target) {
            setTitle(target.title);
            setCompanyName(target.companyName || '');
            setDescription(target.description);
            setMaxProjects(target.maxProjects);
            setProjectTags(target.projectTags || []);
            setDeadline(target.deadline ? new Date(target.deadline).toISOString().split('T')[0] : '');
            setVersion(target.version);
            setSelectedAttributeIds(target.attributes?.map(a => a.id) || []);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadPositionData();
  }, [id, isEditMode]);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    if (!projectTags.includes(tagInput.trim())) {
      setProjectTags([...projectTags, tagInput.trim()]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setProjectTags(projectTags.filter(t => t !== tagToRemove));
  };

  const handleToggleAttribute = (attrId) => {
    setSelectedAttributeIds(prev =>
      prev.includes(attrId) ? prev.filter(item => item !== attrId) : [...prev, attrId]
    );
  };

const handleAddNewAttribute = async () => {
  if (!newAttrName.trim()) {
    alert("Please enter an attribute name!");
    return;
  }
  setIsAddingAttribute(true);
  
  try {
    const res = await fetch('http://localhost:5001/api/attribute/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newAttrName, dataType: newAttrType })
    });
    
    if (res.ok) {
      alert("✨ New attribute added to the shared pool!");
      setNewAttrName('');
      
      if (typeof fetchGlobalAttributes === 'function') {
        fetchGlobalAttributes(); 
      } else if (typeof fetchAttributes === 'function') {
        fetchAttributes();
      }
    } else {
      alert("Failed to add attribute.");
    }
  } catch (err) {
    console.error("Error adding attribute:", err);
    alert("Connection failure.");
  } finally {
    setIsAddingAttribute(false);
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    const payload = {
      title,
      companyName,
      description,
      maxProjects,
      projectTags,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      attributeIds: selectedAttributeIds,
      version
    };

    const url = isEditMode 
      ? `http://localhost:5001/api/position/${id}` 
      : 'http://localhost:5001/api/position/create';
      
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        navigate('/recruiter/dashboard');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      alert('Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-base-100 rounded-2xl shadow-xl text-white">
      <div className="mb-6 border-b border-base-200 pb-4">
        <h2 className="text-xl font-bold">{isEditMode ? 'Edit Position Template' : 'Create Target Position Template'}</h2>
        <p className="text-xs opacity-60 mt-1">Define requirements, filtered project tags, and structured custom attributes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="form-control w-full">
          <label className="label text-sm font-semibold opacity-80">Job Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full rounded-xl border border-b-gray-700 bg-base-200 text-white focus:border-primary text-sm"
            placeholder="e.g., Senior React Developer"
            required
          />
        </div>
        
        <div className="form-control w-full">
          <label className="label text-sm font-semibold opacity-80">Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="input input-bordered w-full rounded-xl border border-b-gray-700 bg-base-200 text-white focus:border-primary text-sm"
            placeholder="e.g., Acme Corporation"
          />
        </div>

        <div className="form-control w-full">
          <label className="label text-sm font-semibold opacity-80">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full rounded-xl border border-b-gray-700 bg-base-200 text-white focus:border-primary h-24 text-sm"
            placeholder="Describe core job responsibilities..."
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label text-sm font-semibold opacity-80">Application Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="input input-bordered w-full rounded-xl bg-base-200 border border-b-gray-700 text-white focus:border-primary text-sm"
            placeholder="YYYY-MM-DD"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control w-full">
            <label className="label text-sm font-semibold opacity-80">Max Allowed Projects in CV</label>
            <input
              type="number"
              value={maxProjects}
              onChange={(e) => setMaxProjects(parseInt(e.target.value) || 0)}
              className="input input-bordered w-full border border-b-gray-700 rounded-xl bg-base-200 text-white focus:border-primary text-sm"
              min="1"
              max="10"
            />
          </div>

          <div className="form-control w-full">
            <label className="label text-sm font-semibold opacity-80">Filter Project Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="input input-bordered  border border-b-gray-700 flex-1 rounded-xl bg-base-200 text-white focus:border-primary text-sm"
                placeholder=" React ....."
              />
              <button type="button" onClick={handleAddTag} className="btn btn-primary rounded-xl text-sm">Add</button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {projectTags.map((tag, idx) => (
                <span key={idx} className="badge badge-secondary gap-1 text-xs">
                  {tag}
                  <span onClick={() => handleRemoveTag(tag)} className="cursor-pointer font-bold opacity-70 hover:opacity-100">×</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="form-control w-full">
          <label className="label text-sm font-semibold opacity-80 mb-1">Select Required Attributes from Shared Pool</label>
          
          <div className="flex gap-2 mb-3 p-3 bg-base-300/50 border border-b-gray-700 rounded-xl   border-white/10">
            <input
              type="text"
              value={newAttrName}
              onChange={(e) => setNewAttrName(e.target.value)}
              className="input input-sm input-bordered flex-1 rounded-lg bg-base-200/70 text-white focus:border-accent text-xs"
              placeholder="New Attribute Name (e.g., Docker Experience)"
            />
            <select 
              value={newAttrType}
              onChange={(e) => setNewAttrType(e.target.value)}
              className="select select-sm select-bordered rounded-lg bg-base-200/70 text-white focus:border-accent text-xs"
            >
              <option value="TEXT">Text</option>
              <option value="NUMBER">Number</option>
              <option value="BOOLEAN">Boolean</option>
            </select>
            <button type="button" onClick={handleAddNewAttribute} className="btn btn-accent btn-sm rounded-lg text-xs">Add to Pool</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-base-200 rounded-xl border border-white/80 scrollbar scrollbar-thumb-cyan-600 scrollbar-track-base-white/80 scrollbar-thin">
            {allAttributes.map((attr) => {
              const isChecked = selectedAttributeIds.includes(attr.id);
              return (
                <label key={attr.id} className="flex items-center gap-3 bg-base-300 p-2 rounded-lg cursor-pointer hover:bg-base-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleAttribute(attr.id)}
                    className="checkbox checkbox-primary checkbox-sm rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{attr.name}</p>
                    <p className="text-[10px] opacity-50">{attr.dataType} · {attr.category?.name}</p>
                  </div>
                </label>
              );
            })}
            {allAttributes.length === 0 && (
              <p className="text-xs opacity-50 col-span-2 text-center py-4">Global Attribute Library is empty.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-base-200 pt-4">
          <button
            type="button"
            onClick={() => navigate('/recruiter/dashboard')}
            className="btn btn-ghost rounded-xl text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary rounded-xl text-white font-bold px-6 text-sm"
          >
            {loading ? 'Saving Template...' : isEditMode ? 'Update Template' : 'Save Template'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PositionForm;