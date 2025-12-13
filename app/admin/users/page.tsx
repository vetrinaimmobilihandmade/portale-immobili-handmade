'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { Users, Download, Search, Filter, Calendar, Mail, Phone, Shield, ArrowLeft, Briefcase } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminUsersPage() {
  const router = useRouter();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const supabase = createClient();

  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [agencyContactFilter, setAgencyContactFilter] = useState<string>('all'); // 🆕 AGGIUNTO

  // Statistiche
  const [stats, setStats] = useState({
    total: 0,
    admin: 0,
    editor: 0,
    inserzionista: 0,
    viewer: 0,
    active: 0,
    verified: 0,
    acceptAgencyContact: 0, // 🆕 AGGIUNTO
  });

  useEffect(() => {
    if (!roleLoading) {
      if (!isAdmin) {
        router.push('/dashboard');
      } else {
        loadUsers();
      }
    }
  }, [roleLoading, isAdmin]);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter, statusFilter, agencyContactFilter]); // 🆕 AGGIUNTO

  const loadUsers = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
      calculateStats(data || []);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userData: any[]) => {
    setStats({
      total: userData.length,
      admin: userData.filter(u => u.role === 'admin').length,
      editor: userData.filter(u => u.role === 'editor').length,
      inserzionista: userData.filter(u => u.role === 'inserzionista').length,
      viewer: userData.filter(u => u.role === 'viewer').length,
      active: userData.filter(u => u.is_active).length,
      verified: userData.filter(u => u.email_verified).length,
      acceptAgencyContact: userData.filter(u => u.accept_agency_contact).length, // 🆕 AGGIUNTO
    });
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filtro ricerca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.full_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query)
      );
    }

    // Filtro ruolo
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filtro status
    if (statusFilter === 'active') {
      filtered = filtered.filter(user => user.is_active);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(user => !user.is_active);
    } else if (statusFilter === 'verified') {
      filtered = filtered.filter(user => user.email_verified);
    } else if (statusFilter === 'unverified') {
      filtered = filtered.filter(user => !user.email_verified);
    }

    // 🆕 NUOVO: Filtro Contatto Agenzia
    if (agencyContactFilter === 'yes') {
      filtered = filtered.filter(user => user.accept_agency_contact);
    } else if (agencyContactFilter === 'no') {
      filtered = filtered.filter(user => !user.accept_agency_contact);
    }

    setFilteredUsers(filtered);
  };

  const exportToCSV = () => {
    // Prepara dati CSV
    const csvData = filteredUsers.map(user => ({
      'ID': user.id,
      'Nome Completo': user.full_name || '',
      'Email': user.email,
      'Telefono': user.phone || '',
      'Ruolo': user.role,
      'Attivo': user.is_active ? 'Sì' : 'No',
      'Email Verificata': user.email_verified ? 'Sì' : 'No',
      'Contatto Agenzia': user.accept_agency_contact ? 'Sì' : 'No', // 🆕 AGGIUNTO
      'Data Registrazione': formatDate(user.created_at),
      'Ultimo Aggiornamento': formatDate(user.updated_at),
    }));

    // Converti in CSV
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => 
      Object.values(row).map(val => `"${val}"`).join(',')
    );
    const csv = [headers, ...rows].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `utenti_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-100 text-red-800',
      editor: 'bg-orange-100 text-orange-800',
      inserzionista: 'bg-blue-100 text-blue-800',
      viewer: 'bg-gray-100 text-gray-800',
    };

    const labels: Record<string, string> = {
      admin: 'Admin',
      editor: 'Editor',
      inserzionista: 'Inserzionista',
      viewer: 'Visualizzatore',
    };

    return (
      <Badge variant="default" className={colors[role] || ''}>
        {labels[role] || role}
      </Badge>
    );
  };

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen bg-neutral-main flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-main py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/moderation')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna al Pannello Admin
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Gestione Utenti
              </h1>
              <p className="text-text-secondary">
                Visualizza ed esporta tutti gli utenti registrati
              </p>
            </div>
          </div>
          
          <Button
            variant="primary"
            onClick={exportToCSV}
            disabled={filteredUsers.length === 0}
          >
            <Download className="w-5 h-5 mr-2" />
            Esporta CSV ({filteredUsers.length})
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-neutral-border p-4">
            <p className="text-sm text-text-secondary mb-1">Totale Utenti</p>
            <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg border border-neutral-border p-4">
            <p className="text-sm text-text-secondary mb-1">Attivi</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg border border-neutral-border p-4">
            <p className="text-sm text-text-secondary mb-1">Email Verificate</p>
            <p className="text-2xl font-bold text-blue-600">{stats.verified}</p>
          </div>
          <div className="bg-white rounded-lg border border-neutral-border p-4">
            <p className="text-sm text-text-secondary mb-1">Inserzionisti</p>
            <p className="text-2xl font-bold text-primary">{stats.inserzionista}</p>
          </div>
          {/* 🆕 NUOVO: Stat Card Contatto Agenzia */}
          <div className="bg-white rounded-lg border border-neutral-border p-4">
            <p className="text-sm text-text-secondary mb-1">Contatto Agenzia</p>
            <p className="text-2xl font-bold text-orange-600">{stats.acceptAgencyContact}</p>
          </div>
        </div>

        {/* Filtri */}
        <div className="bg-white rounded-xl border border-neutral-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-text-secondary" />
            <h3 className="font-semibold text-text-primary">Filtri</h3>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <Input
              placeholder="Cerca per nome, email, telefono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Tutti i ruoli</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="inserzionista">Inserzionista</option>
                <option value="viewer">Visualizzatore</option>
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Tutti gli stati</option>
                <option value="active">Solo attivi</option>
                <option value="inactive">Solo inattivi</option>
                <option value="verified">Email verificata</option>
                <option value="unverified">Email non verificata</option>
              </select>
            </div>

            {/* 🆕 NUOVO: Filtro Contatto Agenzia */}
            <div>
              <select
                value={agencyContactFilter}
                onChange={(e) => setAgencyContactFilter(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Contatto Agenzia</option>
                <option value="yes">Sì (Interessati)</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabella Utenti */}
        <div className="bg-white rounded-xl border border-neutral-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-main border-b border-neutral-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                    Utente
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                    Contatti
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                    Ruolo
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                    Stato
                  </th>
                  {/* 🆕 NUOVA: Colonna Contatto Agenzia */}
                  <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                    Agenzia
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                    Registrato
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Search className="w-12 h-12 text-text-disabled mx-auto mb-3" />
                      <p className="text-text-secondary">Nessun utente trovato</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-neutral-main transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-lighter rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold text-sm">
                              {user.full_name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">
                              {user.full_name || 'Nessun nome'}
                            </p>
                            <p className="text-xs text-text-secondary font-mono">
                              ID: {user.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                              <Phone className="w-4 h-4" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <Badge 
                            variant="default" 
                            className={user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          >
                            {user.is_active ? 'Attivo' : 'Inattivo'}
                          </Badge>
                          {user.email_verified && (
                            <Badge variant="default" className="bg-blue-100 text-blue-800">
                              ✓ Verificato
                            </Badge>
                          )}
                        </div>
                      </td>
                      {/* 🆕 NUOVA: Colonna Contatto Agenzia */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className={`w-4 h-4 ${user.accept_agency_contact ? 'text-orange-600' : 'text-gray-400'}`} />
                          <Badge 
                            variant="default" 
                            className={user.accept_agency_contact ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'}
                          >
                            {user.accept_agency_contact ? 'Sì' : 'No'}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(user.created_at)}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-text-secondary">
          Mostrando {filteredUsers.length} di {users.length} utenti
        </div>

      </div>
    </div>
  );
}
