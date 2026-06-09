"use client";

import React from 'react';
import { useAuth } from '@/hooks/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AuthDebug: React.FC = () => {
  const { user } = useAuth();

  return (
    <Card className="fixed bottom-4 right-4 w-80">
      <CardHeader>
        <CardTitle className="text-sm">Debug de Autenticação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs">
          <strong>Status:</strong> {user ? 'Autenticado' : 'Não autenticado'}
        </div>
        {user && (
          <div className="text-xs">
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>ID:</strong> {user.id}</div>
          </div>
        )}
        <div className="text-xs text-gray-500">
          Componente de debug - Em desenvolvimento
        </div>
      </CardContent>
    </Card>
  );
};