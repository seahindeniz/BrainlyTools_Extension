#!/bin/bash
for d in */ ; do
	echo "$d"

	for f in $d/*
	do
		$file_name = $f | cut -d'_' -f 2
		echo "Processing $f"  
	done
done
