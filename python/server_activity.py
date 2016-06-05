#!/usr/bin/env python
# coding: utf8

############################################################
# This code uses the Beebotte API, you must have an account.
# You can register here: http://beebotte.com/register
############################################################

import os
import time

# Install psutil if it is not already there (example: pip install psutil)
import psutil

from beebotte import *

# import the configuration file 
import conf

bbt = BBT(conf._accesskey, conf._secretkey)

# Create channel and resources to report your server stats

# Change the channel and resource names as suits you
cpu_resource  = Resource(bbt, 'sanbox', 'cpu')
mem_resource  = Resource(bbt, 'sandbox', 'memory')
disk_resource = Resource(bbt, 'sandbox', 'disk')
net_resource  = Resource(bbt, 'sandbox', 'eth0')

debug = conf._debug

def printData(cpu_times, mem, disk, netif):
  if debug:
    print cpu_times
    print mem
    print disk
    print netif

def getNetStats(new, last, ifname):
  retval = {'rx_bytes': new[ifname].bytes_recv - last[ifname].bytes_recv,
    'rx_packets': new[ifname].packets_recv - last[ifname].packets_recv,
    'tx_bytes': new[ifname].bytes_sent - last[ifname].bytes_sent,
    'tx_packets': new[ifname].packets_sent - last[ifname].packets_sent}

  return retval

def getCPUStats(new, last):
  tot = new.user - last.user + new.nice - last.nice + new.system \
        - last.system + new.idle - last.idle + new.irq - last.irq \
        + new.iowait - last.iowait + new.softirq - last.softirq \
        + new.steal - last.steal

  retval = {
    'user': (new.user - last.user)*100/tot,
    'nice': (new.nice - last.nice)*100/tot,
    'sys': (new.system - last.system)*100/tot,
    'idle': (new.idle - last.idle)*100/tot,
    'irq': (new.irq - last.irq + new.softirq - last.softirq)*100/tot
  }

  return retval

def run():

  print "Starting System data reading and submission to Beebotte"
  last_cpu_times = None
  last_net_stats = None

  while True:
    cpu_times = psutil.cpu_times()
    mem = psutil.virtual_memory()
    disk = psutil.disk_usage(conf._mount)
    netif = psutil.net_io_counters(pernic=True)
    printData(cpu_times, mem, disk, netif)

    #Send CPU data to Beebotte
    if last_cpu_times:
      cpu_stats = getCPUStats(cpu_times, last_cpu_times)
      try:
        cpu_resource.write(cpu_stats)
      except Error as err:
        print "Error Writing"
        if debug:
          print err

    last_cpu_times = cpu_times

    try:
      #Send Memory usage
      mem_resource.write({
        'memtotal': mem.total,
        'memfree': mem.free,
        'cached': mem.cached,
        'dirty': 0
      })

      #Send Disk usage
      disk_resource.write({
        'size': disk.total,
        'used': disk.used
      })

      #Send eth0 usage stats
      if last_net_stats:
        net_stats = getNetStats(netif, last_net_stats, conf._ifname)
        net_resource.write(net_stats)
      last_net_stats = netif

    except Error as err:
      print "Error Writing"
      if debug:
        print err

    #Sleep some time
    time.sleep(conf._period)

run()
