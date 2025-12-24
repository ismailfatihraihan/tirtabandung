"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Save, Bell, Shield, Database, User } from "lucide-react"

export function SettingsPage() {
  const [settings, setSettings] = useState({
    systemName: "TirtaBandung Water Quality System",
    location: "Bandung, West Java, Indonesia",
    timezone: "Asia/Jakarta",
    language: "Indonesian",
    emailNotifications: true,
    criticalAlerts: true,
    weeklyReports: true,
    monthlyReports: false,
    dataRetention: "12",
    backupFrequency: "daily",
    adminEmail: "admin@tirabandung.gov.id",
  })

  const handleChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-600 mt-2">Configure system parameters and preferences</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            General Configuration
          </CardTitle>
          <CardDescription>Basic system information and location settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="systemName">System Name</Label>
            <Input
              id="systemName"
              value={settings.systemName}
              onChange={(e) => handleChange("systemName", e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={settings.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => handleChange("timezone", value)}>
                <SelectTrigger id="timezone" className="max-w-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Jakarta">Asia/Jakarta (UTC+7)</SelectItem>
                  <SelectItem value="Asia/Bangkok">Asia/Bangkok (UTC+7)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={settings.language} onValueChange={(value) => handleChange("language", value)}>
                <SelectTrigger id="language" className="max-w-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Indonesian">Indonesian (Bahasa Indonesia)</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Configure email and alert notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Admin Email</Label>
            <Input
              id="adminEmail"
              type="email"
              value={settings.adminEmail}
              onChange={(e) => handleChange("adminEmail", e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between max-w-md">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(value) => handleChange("emailNotifications", value)}
              />
            </div>

            <div className="flex items-center justify-between max-w-md">
              <Label htmlFor="criticalAlerts">Critical Alerts</Label>
              <Switch
                id="criticalAlerts"
                checked={settings.criticalAlerts}
                onCheckedChange={(value) => handleChange("criticalAlerts", value)}
              />
            </div>

            <div className="flex items-center justify-between max-w-md">
              <Label htmlFor="weeklyReports">Weekly Reports</Label>
              <Switch
                id="weeklyReports"
                checked={settings.weeklyReports}
                onCheckedChange={(value) => handleChange("weeklyReports", value)}
              />
            </div>

            <div className="flex items-center justify-between max-w-md">
              <Label htmlFor="monthlyReports">Monthly Reports</Label>
              <Switch
                id="monthlyReports"
                checked={settings.monthlyReports}
                onCheckedChange={(value) => handleChange("monthlyReports", value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Management
          </CardTitle>
          <CardDescription>Configure data retention and backup policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="dataRetention">Data Retention (months)</Label>
              <Select value={settings.dataRetention} onValueChange={(value) => handleChange("dataRetention", value)}>
                <SelectTrigger id="dataRetention" className="max-w-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                  <SelectItem value="36">36 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backupFrequency">Backup Frequency</Label>
              <Select
                value={settings.backupFrequency}
                onValueChange={(value) => handleChange("backupFrequency", value)}
              >
                <SelectTrigger id="backupFrequency" className="max-w-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </CardTitle>
          <CardDescription>System security and access control settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            Security policies are enforced at the system level. For advanced security configurations, please contact
            system administrator.
          </p>
          <Button variant="outline" className="w-full sm:w-auto bg-transparent">
            Manage User Roles & Permissions
          </Button>
          <Button variant="outline" className="w-full sm:w-auto bg-transparent">
            View Activity Log
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  )
}
